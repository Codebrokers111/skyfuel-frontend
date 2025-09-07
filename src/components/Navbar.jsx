import React, { useEffect, useRef, useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userContext } from "../context/userContext";
import { useMediaQuery } from "react-responsive";

const Navbar = ( props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { Logdin, showAlert } = props.prop;
  const navigate = useNavigate();
  const context = useContext(userContext);
  const { user, getUser, updateUser } = context;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const location = useLocation();
  let ref = useRef(null);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    localStorage.getItem("token") && getUser();
    // eslint-disable-next-line
  }, []);

  const rollNavBack = () => {
    isTabletOrMobile && ref.current.click();
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("skyfuel-userId");
    navigate("/");
    showAlert("Logged Out", "primary");
    rollNavBack();
    Logdin();
    updateUser();
  };

  const getInitials = (name) => {
    if (!name) return "Name";
    return name
      .trim()
      .split(" ")
      .filter((word) => word)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-2.5 dark:bg-gray-800">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        {/* Logo */}
        <Link to="/" className="flex items-center ">
          <span className={`self-center text-xl font-semibold whitespace-nowrap dark:text-white ${location.pathname === "/signup" ? "text-red-600" : "text-blue-600"}`}>
            skyfuel
          </span>
        </Link>

        {/* Hamburger button for mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          aria-controls="navbar-main"
          aria-expanded={isMenuOpen}
          ref={ref}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Menu (shared for mobile + desktop) */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:items-center md:space-x-10`}
          id="navbar-main"
        >
          {/* Navlinks */}
          <ul className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block text-gray-700 dark:text-gray-200 hover:text-black-600 px-2 py-2 transition-colors ${
                    location.pathname === link.path
                      ? "font-semibold text-blue-600"
                      : ""
                  }`}
                  onClick={rollNavBack}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          {/* Action buttons (Login/Signup) */}
          {!localStorage.getItem("token") ? (
            <form className="d-flex">
              <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:flex-row md:space-y-0 md:space-x-3 md:ml-auto">
              <Link
                style={{
                  display: `${
                    location.pathname === "/login" ? "none" : "initial"
                  }`,
                }}
                className={`border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded text-sm text-center transition-colors`}
                role="button"
                to={"/login"}
                onClick={rollNavBack}
              >
                Login
              </Link>
              <Link
                style={{
                  display: `${
                    location.pathname === "/signup" ? "none" : "initial"
                  }`,
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded text-sm text-center transition-colors"
                role="button"
                to={"/signup"}
                onClick={rollNavBack}
              >
                Signup
              </Link>
              </div>
            </form>
          ) : (
            <div className="relative inline-block text-left">
            <button
              id="dropdownUserButton"
              data-dropdown-toggle="dropdownUserMenu"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                        focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                        text-sm px-5 py-2.5 text-center inline-flex items-center
                        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              <i className="fa-solid fa-user mr-2 text-yellow-400"></i>
              {getInitials(user.name)}
              <svg
                className="w-2.5 h-2.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div
              id="dropdownUserMenu"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg 
                        shadow-sm w-56 dark:bg-gray-700"
            >
              <div className="px-4 py-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                  {user.email}
                </p>
              </div>

              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownUserButton"
              >
                <li>
                  <Link
                    to="/account?details"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <i className="fa-solid fa-house fa-sm mr-2"></i> Account
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/urls?dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <i className="fa-solid fa-link fa-sm mr-2"></i> URLs
                  </Link>
                </li> */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 
                              dark:hover:bg-gray-600 dark:text-red-400"
                    type="button"
                  >
                    <i className="fa-solid fa-right-from-bracket fa-sm mr-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
            
          </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
