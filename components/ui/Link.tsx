import NextLink from "next/link";

export default function Link(props: Parameters<typeof NextLink>[0]) {
    let rel: React.HTMLAttributes<HTMLLinkElement>["rel"] = undefined;

    if (props.target === "_blank") {
        rel = "noopener noreferrer";
    }

    return (
        <NextLink
            rel={rel}
            {...props}
        />
    );
}