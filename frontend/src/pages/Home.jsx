import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskCard from "../components/Taskcard";
import Footer from "../components/Footer";

const Home = () => {
  // Remove fake tasks for production
  const tasks = []; // Keep empty for now

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-2 bg-dark text-white position-sticky top-0 vh-100">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-10 d-flex flex-column min-vh-100">
          <Header />

          {/* Task Section (Maintains Grid Structure) */}
          <div className="container-fluid flex-grow-1 p-3">
            <div className="row justify-content-center">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <div key={index} className="col-md-4">
                    <TaskCard task={task} />
                  </div>
                ))
              ) : (
                // Empty state to maintain structure
                <div className="col-12 text-center text-muted mt-5">
                  <h4>No tasks yet, add one!</h4>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
