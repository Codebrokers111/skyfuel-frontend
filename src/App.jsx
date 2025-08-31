import { useState } from 'react'
import './App.css'
import {  BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Alert from './components/Alert'; 
import Footer from './components/Footer';
import UserState from "./context/UserState";
import Scrolltotop from './components/Scrolltotop';
import Login from './components/Login';

function App() {
  const [alert, setAlert] = useState(null);
  const [login, setLogin] = useState(true);
  const host = import.meta.env.VITE_HOST;
  const c_sitekey = import.meta.env.VITE_CAPTCHA_SITE_KEY;
  console.log("Host:", host);

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
  return (
    <UserState prop={{ host, showAlert }}>
      <Router>
        <Scrolltotop />
        <Navbar prop={{showAlert, Logdin, Logdout, login}}/>
        <Alert alert={alert} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login prop={{ host, Logdout, showAlert, c_sitekey }} />}></Route>
          {/* <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
        <Footer/>
    </Router>
    </UserState>
  )
}

export default App;
