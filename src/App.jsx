import { useState, useEffect } from "react";
import "./App.css";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { initFlowbite } from "flowbite";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import UserState from "./context/UserState";
import Scrolltotop from "./components/Scrolltotop";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  const [alert, setAlert] = useState(null);
  const [login, setLogin] = useState(true);
  const host = import.meta.env.VITE_HOST;
  const c_sitekey = import.meta.env.VITE_CAPTCHA_SITE_KEY;

  useEffect(() => {
    initFlowbite();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ msg: message, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const Logdin = () => {
    setLogin(true);
  };

  const Logdout = () => {
    setLogin(false);
  };

  const setCookie = (uid, val) => {
    Cookies.set(uid, val, {
      expires: 1,
      secure: true,
      sameSite: "Strict",
    });
  };

  return (
    <UserState prop={{ host, showAlert }}>
      <Router>
        <Scrolltotop />
        <Navbar prop={{ showAlert, Logdin, Logdout, login }} />
        <Alert alert={alert} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login prop={{ host, Logdout, showAlert, c_sitekey }} />}
          ></Route>
          <Route
            exact
            path="/signup"
            element={<Signup prop={{ host, Logdout, showAlert, c_sitekey }} />}
          ></Route>
          <Route
            exact
            path="/forgot-password"
            element={<ForgotPassword prop={{ host, showAlert, setCookie }} />}
          ></Route>
          {/* <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </UserState>
  );
}

export default App;
