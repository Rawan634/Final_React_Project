import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginSignup from "./pages/LoginSignup";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/dashboard" element={<Home />} />
    </Routes>
  );
}

export default App;
