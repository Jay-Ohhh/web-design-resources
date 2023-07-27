export type GithubData = {
    html_url: string;
    owner: {
        avatar_url: string;
    };
    homepage: string;
    message: string;
    name: string;
    full_name: string;
    stargazers_count: number;
    description: string;
    open_issues_count: number;
    topics: string[];
};
