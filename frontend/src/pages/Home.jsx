import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

const Home = () => {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-2 bg-dark text-white position-sticky top-0 vh-100">
          <Sidebar status={status} setStatus={setStatus} priority={priority} setPriority={setPriority} />
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-10 d-flex flex-column min-vh-100">
          <Header />
          <Footer filters={{ priority, status }} />
        </div>
      </div>
    </div>
  );
};

export default Home;
