import { type Metadata } from "next";
import AddForm from "./AddForm";

export const metadata: Metadata = {
    title: "Add new resource"
};

export default function AddResource() {
    return (
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-12 px-4 py-16 md:flex-row">
            <AddForm />
        </div>
    );
}