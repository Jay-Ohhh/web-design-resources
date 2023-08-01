import { env } from "@/env/server.mjs";
import { type GithubData } from "@/types/GithubData";

export async function getGithubRepo(url: string) {
    const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, "");
    const path = urlWithoutProtocol.split("/").slice(1).join("/");
    /**
     * @see https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
     */
    return await fetch(`https://api.github.com/repos/${path}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN || ""}`,
        },
        cache: "no-store",
    }).then((res) => res.json()) as GithubData;
}