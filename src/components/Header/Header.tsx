export function Header({
  image,
  imageFallback,
  title,
  children,
}: {
  image?: string;
  imageFallback?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="sm:flex sm:space-x-5 pb-5 sm:pt-5 items-center">
      {image ? (
        <div className="shrink-0">
          <img
            alt={title}
            src={image}
            className="mx-auto sm:w-50 lg:w-40 xl:w-50 sm:rounded-lg"
          />
        </div>
      ) : imageFallback ? (
        <div className="bg-gray-400 text-center text-white text-xs rounded-lg hidden lg:block w-40 h-53 pt-26 xl:w-50 xl:h-67 xl:pt-33">
          {imageFallback}
        </div>
      ) : (
        <></>
      )}
      <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
        <p className="font-bold text-gray-900 text-2xl sm:text-4xl xl:text-5xl">
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}
