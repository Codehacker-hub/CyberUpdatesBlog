import React from "react";

const ErrorFallback = ({ message = "Something went wrong!", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-32 space-y-4  text-blue-700 p-4 r">
      <p className="text-lg font-semibold">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="py-2 px-4 rounded-3xl bg-blue-800 text-white hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;