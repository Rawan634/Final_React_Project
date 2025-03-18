import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskCard from "../components/Taskcard";
import Footer from "../components/Footer";

const Home = () => {

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-2 bg-dark text-white position-sticky top-0 vh-100">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10 d-flex flex-column">
          <Header />

          {/* Task Cards */}
          <div className="container-fluid flex-grow-1 p-3">
            <div className="row">
              {tasks.map((task, index) => (
                <div key={index} className="col-md-4">
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;