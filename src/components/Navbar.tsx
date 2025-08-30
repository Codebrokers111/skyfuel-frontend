import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600 dark:text-white">
            SkyFuel
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded ${
              location.pathname === "/" ? "bg-blue-100 dark:bg-gray-700" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/services"
            className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded ${
              location.pathname === "/services" ? "bg-blue-100 dark:bg-gray-700" : ""
            }`}
          >
            Services
          </Link>
          <Link
            to="/support"
            className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded ${
              location.pathname === "/support" ? "bg-blue-100 dark:bg-gray-700" : ""
            }`}
          >
            Support
          </Link>
          <Link
            to="/login"
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
