import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskBoard from "../components/TaskBoard";
import { useState } from "react";

const Home = () => {
  const [priority, setPriority] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white vh-100">
          <Sidebar 
            priority={priority} 
            setPriority={setPriority} 
            showFavorites={showFavorites} 
            setShowFavorites={setShowFavorites} 
          />
        </div>
        
        {/* Main Content */}
        <div className="col-md-10 d-flex flex-column vh-100 p-0">
          <Header />
          <TaskBoard priorityFilter={priority} favoritesFilter={showFavorites} />
        </div>
      </div>
    </div>
  );
};

export default Home;