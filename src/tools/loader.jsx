import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="relative">
        <div className="w-14 h-14 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-orange-500 font-bold text-sm">T</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500 tracking-wide">
        Loading, please wait...
      </p>
    </div>
  );
}
