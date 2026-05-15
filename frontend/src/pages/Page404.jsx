import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh w-full items-center justify-center">

      <section className="flex items-center p-16">
        <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
          <div className="max-w-md text-center">
            <h2 className="mb-8 text-9xl font-extrabold text-gray-400">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl text-gray-400 font-semibold md:text-3xl">
              Sorry, we couldn't find this page.
            </p>
            <p className="mt-4 mb-8 dark:text-gray-600">
              But dont worry, you can find plenty of other things on our
              homepage.
            </p>
            <div className="w-full flex gap-2">
              <button
              onClick={() => navigate(-1)}
              className="w-full rounded px-8 py-3 font-semibold dark:bg-violet-600 dark:text-gray-50"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full rounded px-8 py-3 font-semibold dark:bg-violet-600 dark:text-gray-50"
            >
              Back to homepage
            </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page404;
