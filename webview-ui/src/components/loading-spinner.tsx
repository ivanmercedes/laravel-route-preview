const LoadingSpiner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-t-4 border-l-4 border-gray-800 dark:border-gray-200 animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-b-4 border-r-4 border-gray-300 dark:border-gray-700 animate-pulse"></div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 animate-pulse">
            Exploring the Laravel route universe 🚀
          </h3>

          <div className="flex justify-center mt-3 space-x-1">
            <span
              className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></span>
            <span
              className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpiner;
