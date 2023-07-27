import { buttonVariants } from "@/components/ui/Button";
import Link from "@/components/ui/Link";
import { FaPlus } from "react-icons/fa";
import { homepageCards } from "@/lib/constants";
import SingleCard from "@/components/HomeCard";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center w-full mx-auto max-w-screen-xl gap-8 px-4 pb-24 pt-12 text-center text-black dark:text-white md:pt-24">
      <h1 className="text-5xl font-extrabold">Web Design Resources</h1>
      <p className="text-gray-600 dark:text-gray-200 md:px-12">
        Web Design Resources is your one-stop destination to find the perfect
        tools for your project&apos;s unique needs. This app is designed to be
        the ultimate hub for developers, offering an extensive collection of
        top-notch resources that are fully compatible with modern Frameworks.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/resources" className={buttonVariants()}>
          Explore resources
        </Link>
        <Link
          href="/resources/add"
          className={buttonVariants({ variant: "outline" })}
        >
          <span className="flex items-center justify-center gap-1">
            <FaPlus />
            Add new resource
          </span>
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {homepageCards.slice(0, 2).map((card) => (
          <SingleCard key={card.id} {...card} />
        ))}
      </div>

      <div className="-mt-3 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {homepageCards.slice(2, 5).map((card) => (
          <SingleCard key={card.id} {...card} />
        ))}
      </div>
    </main>
  );
}
