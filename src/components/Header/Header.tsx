import { useState } from "react";

export function Header({
  image,
  imageFallback,
  title,
  subtitle,
  children,
}: {
  image?: string;
  imageFallback?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>(undefined);
  const loaded = loadedSrc === image;

  return (
    <div className="sm:flex sm:space-x-5 pb-5 sm:pt-5 items-center">
      {image ? (
        <div className="shrink-0">
          <div className="relative mx-auto w-full aspect-[3/4] sm:w-50 lg:w-40 xl:w-50">
            {!loaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 sm:rounded-lg"></div>
            )}
            <img
              alt={title}
              src={image}
              onLoad={() => setLoadedSrc(image)}
              className={
                "w-full h-full object-cover sm:rounded-lg" +
                (loaded ? "" : " invisible")
              }
            />
          </div>
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
          {subtitle && (
            <span className="text-xl font-normal"> ({subtitle})</span>
          )}
        </p>
        {children}
      </div>
    </div>
  );
}
