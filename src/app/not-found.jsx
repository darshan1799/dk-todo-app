"use client";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaHome } from "react-icons/fa";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex justify-center items-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8 space-y-6 backdrop-blur-sm">
          {/* 404 Number */}
          <div className="space-y-4">
            <div className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              404
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
            <p className="text-gray-500">
              The page you're looking for doesn't exist.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 cursor-pointer"
            >
              <FaArrowLeft className="w-5 h-5" />
              Go Back
            </button>

            <button
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              <FaHome className="w-5 h-5" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
