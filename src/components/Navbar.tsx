import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import { userContext } from "../Context/userContext";
import { useMediaQuery } from "react-responsive";

// ---- Props Type ----
interface NavbarProps {
  prop: {
    Logdin: () => void;
    showAlert: (msg: string, type: string) => void;
  };
}

// ---- User Context Type ----
// interface User {
//   name: string;
//   email: string;
// }

// interface UserContextType {
//   user: User;
//   getUser: () => void;
//   updateUser: () => void;
// }

const Navbar: React.FC<NavbarProps> = (): JSX.Element => {
  // const { Logdin, showAlert } = prop;

  const navigate = useNavigate();
  // const context = useContext(userContext) as UserContextType;
  // const { user, getUser, updateUser } = context;

  // ---- Refs ----
  const ref = useRef<HTMLButtonElement | null>(null);
  const serviceref = useRef<HTMLAnchorElement | null>(null);
  const scanneref = useRef<HTMLAnchorElement | null>(null);
  const supportref = useRef<HTMLAnchorElement | null>(null);

  const location = useLocation();

  const [searchParams, setSearchParams] = useState<{ s: string; id: string }>({
    s: "",
    id: "",
  });

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  // ---- Effects ----
  // useEffect(() => {
  //   if (localStorage.getItem("token")) getUser();
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("s") ?? "";
    const id = params.get("id") ?? "";

    if (s || id) {
      setSearchParams({ s, id });
      console.log("login", s, id);
    }
  }, [location]);

  // ---- Handlers ----
  const rollNavBack = () => {
    if (isTabletOrMobile && ref.current) {
      ref.current.click();
    }
  };

  const handleService = () => serviceref.current?.click();
  const handleSupport = () => supportref.current?.click();
  const handleScanner = () => scanneref.current?.click();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("curlmin-userId");
    navigate("/");
    // showAlert("Logged Out", "primary");
    rollNavBack();
    // Logdin();
    // updateUser();
  };

  const getInitials = (name: string): string => {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  // ---- JSX ----
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link
          className={`navbar-brand fw-bold ${
            location.pathname === "/signup" ? "text-danger" : "text-primary"
          }`}
          to="/"
        >
          SkyFuel
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ref={ref}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Home */}
            <li className="nav-item me-2">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                aria-current="page"
                to="/"
                onClick={rollNavBack}
              >
                Home
              </Link>
            </li>

            {/* Services Dropdown */}
            <li className="nav-item dropdown me-2">
              <a
                className={`nav-link dropdown-toggle ${
                  ["/qrcode", "/barcode", "/curltag", "/image"].includes(
                    location.pathname
                  )
                    ? "active"
                    : ""
                }`}
                href="/"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ref={serviceref}
              >
                Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/qrcode"
                    onClick={() => {
                      rollNavBack();
                      handleService();
                    }}
                  >
                    QR Code
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/barcode"
                    onClick={() => {
                      rollNavBack();
                      handleService();
                    }}
                  >
                    Barcode
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/curltag"
                    onClick={() => {
                      rollNavBack();
                      handleService();
                    }}
                  >
                    Curltag
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/image"
                    onClick={() => {
                      rollNavBack();
                      handleService();
                    }}
                  >
                    Image
                  </Link>
                </li>
              </ul>
            </li>

            {/* Scanners Dropdown */}
            <li className="nav-item dropdown me-2">
              <a
                className={`nav-link dropdown-toggle ${
                  location.pathname === "/barcode-scanner" ? "active" : ""
                }`}
                href="/"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ref={scanneref}
              >
                Scanners
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/barcode-scanner"
                    onClick={() => {
                      rollNavBack();
                      handleScanner();
                    }}
                  >
                    Barcode
                  </Link>
                </li>
              </ul>
            </li>

            {/* Support Dropdown */}
            <li className="nav-item dropdown me-2">
              <a
                className={`nav-link dropdown-toggle ${
                  ["/help-center", "/contactus"].includes(location.pathname)
                    ? "active"
                    : ""
                }`}
                href="/"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ref={supportref}
              >
                Support
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/help-center"
                    onClick={() => {
                      rollNavBack();
                      handleSupport();
                    }}
                  >
                    Help Center
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/contactus"
                    onClick={() => {
                      rollNavBack();
                      handleSupport();
                    }}
                  >
                    Contactus
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Auth Buttons */}
          {!localStorage.getItem("token") ? (
            <form className="d-flex">
              <Link
                style={{
                  display:
                    location.pathname === "/login" ? "none" : "initial",
                }}
                className={`btn btn-outline-${
                  location.pathname === "/signup" ? "danger" : "primary"
                } btn-sm mx-1`}
                role="button"
                to={
                  searchParams.s !== ""
                    ? `/login?s=${searchParams.s}&id=${searchParams.id}`
                    : "/login"
                }
                onClick={rollNavBack}
              >
                Login
              </Link>
              <Link
                style={{
                  display:
                    location.pathname === "/signup" ? "none" : "initial",
                }}
                className="btn btn-primary btn-sm mx-1"
                role="button"
                to={
                  searchParams.s !== ""
                    ? `/signup?s=${searchParams.s}&id=${searchParams.id}`
                    : "/signup"
                }
                onClick={rollNavBack}
              >
                Signup
              </Link>
            </form>
          ) : (
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-secondary dropdown-toggle mx-2 me-2 d-flex flex-row align-items-center"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                <i
                  className="fa-solid fa-user me-2"
                  style={{ color: "#FFD43B" }}
                ></i>
                {getInitials("Mohd Zain")}
              </button>
              <ul className="dropdown-menu dropdown-menu-lg-end">
                <li style={{ marginBottom: "0px" }}>
                  <h5
                    className="dropdown-item"
                    style={{ marginBottom: "0px", paddingBottom: "0px" }}
                  >
                    {"Mohd Zain"}
                    <p
                      className="text-muted mt-1"
                      style={{ fontSize: "14px", paddingBottom: "0px" }}
                    >
                      {"zainmohd@gmail.com"}
                    </p>
                  </h5>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="mb-1">
                  <Link
                    to="/account?details"
                    className="dropdown-item"
                    type="button"
                    onClick={rollNavBack}
                  >
                    <i className="fa-solid fa-house fa-sm me-1"></i> Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/urls?dashboard"
                    className="dropdown-item"
                    type="button"
                    onClick={rollNavBack}
                  >
                    <i className="fa-solid fa-link fa-sm me-1"></i> URLs
                  </Link>
                </li>
                <li className="d-flex justify-content-center my-3">
                  <button
                    className="btn btn-outline-danger btn-sm px-3"
                    onClick={handleLogout}
                    type="button"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
