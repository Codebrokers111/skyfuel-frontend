import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {


  return (
    <>
    <Router>
      <Navbar prop={""} />
    </Router>
      
    </>
  )
}

export default App
