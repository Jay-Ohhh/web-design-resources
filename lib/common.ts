import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isBrowser() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}

export function numberFormatter(num?: number, digits?: number) {
    if (!num) return "0";

    const lookup = [
        { value: 1e18, symbol: "E" },
        { value: 1e15, symbol: "P" },
        { value: 1e12, symbol: "T" },
        { value: 1e9, symbol: "G" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "K" },
        { value: 1, symbol: "" },
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.find(item => num >= item.value);

    return item
        ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
        : "0";
}

export function slugify(str: string) {
    return String(str).toLowerCase().replaceAll("_", "-");
}