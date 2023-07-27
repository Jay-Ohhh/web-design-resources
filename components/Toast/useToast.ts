// Inspired by react-hot-toast library
import React, { useState, useEffect } from "react";

import type { ToastActionElement, ToastProps } from "./Toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
};

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
    | {
        type: ActionType["ADD_TOAST"];
        toast: ToasterToast;
    }
    | {
        type: ActionType["UPDATE_TOAST"];
        toast: Partial<ToasterToast>;
    }
    | {
        type: ActionType["DISMISS_TOAST"];
        toastId?: ToasterToast["id"];
    }
    | {
        type: ActionType["REMOVE_TOAST"];
        toastId?: ToasterToast["id"];
    };

interface State {
    toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "ADD_TOAST": {
            addToRemoveQueue(action.toast.id);

            return {
                ...state,
                toasts: [
                    ({
                        ...action.toast,
                        onOpenChange: (open) => {
                            if (!open) toast.dismiss(action.toast.id);
                        }
                    }) as ToasterToast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT),
            };
        }

        case "UPDATE_TOAST": {
            if (!action.toast.id) return state;

            state.toasts.find((item, index) => {
                if (item.id === action.toast.id) {
                    state.toasts[index] = {
                        ...item,
                        ...action.toast,
                    };

                    return true;
                }

                return false;
            });

            return {
                ...state,
                toasts: [...state.toasts],
            };
        }

        case "DISMISS_TOAST": {
            const { toastId } = action;

            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach(item => {
                    addToRemoveQueue(item.id);
                });
            }

            return {
                ...state,
                toasts: state.toasts.map(item =>
                    (item.id === toastId || !toastId)
                        ? {
                            ...item,
                            open: false,
                        }
                        : item
                )
            };
        }

        case "REMOVE_TOAST": {
            if (!action.toastId) {
                return {
                    ...state,
                    toasts: [],
                };
            }

            return {
                ...state,
                toasts: state.toasts.filter(item => item.id !== action.toastId)
            };
        }
    }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);

    listeners.forEach(item => {
        item(memoryState);
    });
}

type Toast = Omit<ToasterToast, "id">;

function toast(props: Toast) {
    const id = genId();

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
        }
    });

    return id;
}

toast.update = (props: ToasterToast) => {
    dispatch({
        type: "UPDATE_TOAST",
        toast: props,
    });
};

toast.dismiss = (id: string) => {
    dispatch({
        type: "DISMISS_TOAST",
        toastId: id
    });
};

function useToast() {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => {
        listeners.push(setState);

        return () => {
            const index = listeners.indexOf(setState);

            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    return {
        ...state,
        toast,
    };
}

export { useToast, toast };