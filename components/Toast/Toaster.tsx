"use client";

import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "./Toast";
import { useToast } from "./useToast";

export default function Toaster() {
    const { toasts } = useToast();

    return (
        /**
         * The opening toasts will not be closed when duration is 0
         * The closing behavior of toast is controlled by toast reducer
         */
        <ToastProvider duration={0}>
            {toasts.map(({ id, title, description, action, ...props }) => {
                return (
                    <Toast key={id} {...props} className="z-[999]">
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription>{description}</ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
