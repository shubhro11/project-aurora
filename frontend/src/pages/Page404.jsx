import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh w-full items-center justify-center">

      <section className="flex items-center p-16">
        <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
          <div className="max-w-md text-center">
            <h2 className="mb-8 text-9xl tracking-wide font-extrabold text-gray-400">
              404
            </h2>
            <p className="text-2xl text-gray-400 font-semibold md:text-3xl">
              Sorry, we couldn't find this page.
            </p>
            <p className="mt-4 mb-8 text-gray-600">
              But dont worry, you can find plenty of other things on our
              homepage.
            </p>
            <div className="w-full flex gap-4">
              <button
              onClick={() => navigate(-1)}
              className="w-full rounded px-8 py-3 font-semibold border border-(--color-secondary-container) text-(--color-on-primary-container) hover:bg-(--color-secondary-container) transition-colors duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full rounded px-8 py-3 font-semibold border border-(--color-secondary-container) text-(--color-on-primary-container) hover:bg-(--color-secondary-container) transition-colors duration-200"
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
