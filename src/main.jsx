import ReactDOM from "react-dom/client";
import React from 'react'
import App from './App.jsx'
import './index.css'
import 'flowbite';
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
const GCI = import.meta.env.VITE_GCI;

root.render(
  <GoogleOAuthProvider clientId={GCI}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);