"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown, FaHome, FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

export default function NavBar() {
  const router = useRouter();

  const handleSignout = async () => {
    //await signOut(authOptions);
    await signOut();
    toast.success("LogOut successfully!");
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogin = () => {
    router.push("/login");
  };
  const { data: session } = useSession();

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Home */}
            <div className="flex items-center space-x-8">
              <Link href="/">
                <div className="flex items-center">
                  <FaHome className="h-6 w-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200" />
                </div>
              </Link>
            </div>

            {/* Right side - Login/User */}
            <div className="flex items-center">
              {!session ? (
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <FaUser className="h-4 w-4" />
                  <span>Login</span>
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <div className="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center">
                      <FaUser className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {session.user.name}
                    </span>
                    <FaChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleSignout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-200 cursor-pointer"
                      >
                        <IoIosLogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
