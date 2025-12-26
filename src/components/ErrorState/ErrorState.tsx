export default function ErrorState({
  statusCode,
  message,
}: {
  statusCode: number;
  message?: string;
}) {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">
            {statusCode}
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            {getTitle(statusCode)}
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {message ?? getDescription(statusCode)}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

function getTitle(statusCode: number) {
  switch (statusCode) {
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 429:
      return "Too Many Requests";
    case 500:
      return "Internal Server Error";
    default:
      return "Something Went Wrong";
  }
}

function getDescription(statusCode: number) {
  switch (statusCode) {
    case 403:
      return "Your account does not have permission to access this page.";
    case 404:
      return "Sorry, we couldn’t find the page you’re looking for.";
    case 429:
      return "Sorry, our server needs a moment to not get too overloaded. Please wait a minute and then try again.";
    case 500:
    default:
      return "Sorry, we are having some technical difficulties. Please wait a minute and then try again.";
  }
}
