import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/common";
import Label from "./Label";

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { label: string; }
>(({ className, label, ...props }, ref) => {
    return (
        <div className="flex items-center">
            <CheckboxPrimitive.Root
                ref={ref}
                className={cn(
                    "flex justify-center items-center w-5 h-5 rounded-md border border-primary",
                    className
                )}
                {...props}
            >
                <CheckboxPrimitive.Indicator>
                    <Check size={16} />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            <Label className="ml-2 cursor-pointer" htmlFor={props.id}>
                {label}
            </Label>
        </div>
    );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export default Checkbox;