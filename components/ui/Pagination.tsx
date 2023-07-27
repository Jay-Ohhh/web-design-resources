"use client";

import { useRef, useState } from "react";
import clsx from "clsx";

export type PaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    onPageChange?: (e: React.MouseEvent | React.ChangeEvent, value: number) => void;
};

export default function Pagination(props: PaginationProps) {
    const [inputPage, setInputPage] = useState<string | number>(props.page || 1);
    const inputPageRef = useRef<number>(isNaN(inputPage as number) ? 1 : inputPage as number);

    if (typeof inputPage === "number") {
        inputPageRef.current = inputPage;
    }

    const count = Math.ceil(props.total / props.pageSize);
    const prevDisabled = count === 1 || inputPageRef.current === 1;
    const nextDisabled = count === 1 || inputPageRef.current === count;

    return (
        <nav className="flex items-center" aria-label="pagination">
            <button
                className={clsx(
                    "inline-flex justify-center items-center mx-2 w-10 h-10 rounded text-primary transition-colors hover:text-primary-foreground hover:bg-primary",
                    prevDisabled && "opacity-50 pointer-events-none"
                )}
                disabled={prevDisabled}
                onClick={(e) => {
                    const value = inputPageRef.current - 1;
                    setInputPage(value);
                    props.onPageChange?.(e, value);
                }}
                aria-label="Go to previous page"
            >
                <svg className="w-5 h-5 fill-current hover:fill-current" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateBeforeIcon">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                </svg>
            </button>

            <input
                className="spin-hidden min-w-[40px] max-w-[55px] h-10 text-center rounded border-2 border-primary focus:border-primary focus-visible:outline-none"
                style={{
                    boxShadow: "none",
                }}
                type="number"
                aria-label="Enter page"
                maxLength={String(count).length}
                value={inputPage}
                onChange={(e) => {
                    const value = Number(e.target.value);

                    if (e.target.value === "") {
                        setInputPage(e.target.value);
                    } else if (value > 0 && value <= count) {
                        setInputPage(value);
                        props.onPageChange?.(e, value);
                    }
                }}
                onBlur={() => {
                    if (inputPage === "" && !isNaN(inputPageRef.current)) {
                        setInputPage(inputPageRef.current);
                    }
                }}
            />

            <span className="mx-2 text-[24px]"> / </span>
            <span>{count}</span>

            <button
                className={clsx(
                    "inline-flex justify-center items-center mx-2 w-10 h-10 rounded text-primary transition-colors hover:text-primary-foreground hover:bg-primary",
                    nextDisabled && "opacity-50 pointer-events-none"
                )}
                disabled={nextDisabled}
                onClick={(e) => {
                    const value = inputPageRef.current + 1;
                    setInputPage(value);
                    props.onPageChange?.(e, value);
                }}
                aria-label="Go to previous page"
            >
                <svg className="w-5 h-5 fill-current hover:fill-current" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateNextIcon">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                </svg>
            </button>
        </nav>
    );
}