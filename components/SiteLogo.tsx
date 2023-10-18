import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

type LogoProps = {
    width: number;
    height: number;
    className?: string;
};

export default function SiteLogo(props: LogoProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? (
        <Image
            {...props}
            src={theme === "dark" ? "/images/icons/logo-dark.svg" : "/images/icons/logo.svg"}
            alt="Site logo"
        />
    ) : (
        <div
            className={props.className}
            style={{
                width: props.width,
                height: props.height,
            }}
        />
    );
}