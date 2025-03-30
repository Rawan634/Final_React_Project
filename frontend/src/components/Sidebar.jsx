import logo from "../assets/Logo.png";
import { FaListUl, FaClock, FaTasks, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle, FaArrowDown } from "react-icons/fa";

const Sidebar = ({ status, setStatus, priority, setPriority }) => {

  function toggleStatus(newStatus) {
    setStatus(newStatus === status ? '' : newStatus);
  }

  function togglePriority(newPriority) {
    setPriority(newPriority === priority ? '' : newPriority);
  }

  return (
    <div className="p-3 vh-100 d-flex flex-column align-items-center text-white">
      {/* Logo */}
      <div className="text-center mb-4">
        <img
          src={logo}
          alt="Logo"
          className="rounded-circle"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      </div>

      {/* Filters Section */}
      <div className="w-100">
        <h5 className="text-center mb-4 fs-4 fw-bold">Filters</h5>
        <div className="d-flex flex-column gap-2">
          <button className={`btn btn-outline-light fs-5 d-flex align-items-center gap-2 mb-2 ${status === '' ? 'bg-success text-white' : ''}`} onClick={() => toggleStatus('')}>
            <FaListUl /> <span>All Tasks</span>
          </button>
          <button className={`btn btn-outline-secondary fs-5 d-flex align-items-center gap-2 mb-2 ${status === 'Pending' ? 'bg-secondary text-white' : ''}`} onClick={() => toggleStatus('Pending')}>
            <FaClock /> <span>Pending</span>
          </button>
          <button className={`btn btn-outline-info fs-5 d-flex align-items-center gap-2 mb-2 ${status === 'In Progress' ? 'bg-info text-white' : ''}`} onClick={() => toggleStatus('In Progress')}>
            <FaTasks /> <span>In Progress</span>
          </button>
          <button className={`btn btn-outline-primary fs-5 d-flex align-items-center gap-2 mb-2 ${status === 'Completed' ? 'bg-primary text-white' : ''}`} onClick={() => toggleStatus('Completed')}>
            <FaCheckCircle /> <span>Completed</span>
          </button>
        </div>
      </div>

      {/* Priority Section */}
      <div className="w-100 mt-4">
        <h5 className="text-center mb-4 fs-4 fw-bold">Priority Levels</h5>
        <div className="d-flex flex-column gap-2">
          <button className={`btn btn-outline-danger fs-5 d-flex align-items-center gap-2 mb-2 ${priority === 'High' ? 'bg-danger text-white' : ''}`} onClick={() => togglePriority('High')}>
            <FaExclamationTriangle /> <span>High</span>
          </button>
          <button className={`btn btn-outline-warning fs-5 d-flex align-items-center gap-2 mb-2 ${priority === 'Medium' ? 'bg-warning text-white' : ''}`} onClick={() => togglePriority('Medium')}>
            <FaExclamationCircle /> <span>Medium</span>
          </button>
          <button className={`btn btn-outline-success fs-5 d-flex align-items-center gap-2 mb-2 ${priority === 'Low' ? 'bg-success text-white' : ''}`} onClick={() => togglePriority('Low')}>
            <FaArrowDown /> <span>Low</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
