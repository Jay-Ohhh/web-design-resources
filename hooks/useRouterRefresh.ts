import { useRouter } from "next/navigation";

const cachePaths = new Set<string>();


export default function useRouterRefresh() {
    const router = useRouter();

    return (url: string) => {
        /**
         * Bug: even if revalidate = false is set, Next.js will still cache the page corresponding to the path.
         * Call router.refresh to reload the data, but it may request twice.
         */
        router.push(url);

        if (cachePaths.has(url)) {
            // clear cache when refresh
            cachePaths.clear();
            router.refresh();
        } else {
            cachePaths.add(url);
        }
    };
}