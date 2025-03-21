import logo from "../assests/Logo.png";

const Sidebar = ({
  status, setStatus, priority, setPriority
}) => {


  function toggleStatus(newStatus) {
    if (newStatus === status) {
      setStatus('')
    } else {
      setStatus(newStatus)
    }
  }

  function togglePriority(newPriority) {
    if (newPriority === priority) {
      setPriority('')
    } else {
      setPriority(newPriority)
    }
  }

  return (
    <div className="p-2 vh-100 d-flex flex-column align-items-center" >
      {/* Logo */}
      <div className="text-white text-center">
        <img
          src={logo}
          alt="Logo"
          className="rounded-circle"
          style={{ width: "130px", height: "130px", objectFit: "cover" }}
        />
      </div>

      {/* Filters Section */}
      <div className="w-100 mt-5">
        <h4 className="text-white text-center mb-3 fw-bold">Filters</h4>
        <div className="d-flex flex-column gap-3">
          <button className={`btn btn-outline-light fs-5 ${status === '' ? 'bg-success text-white' : ''}`} onClick={() => toggleStatus('')}>All Tasks</button>
          <button className={`btn btn-outline-success fs-5 ${status === 'In Progress' ? 'bg-success text-white' : ''}`} onClick={() => toggleStatus('In Progress')}>In Progress</button>
          <button className={`btn btn-outline-primary fs-5 ${status === 'Completed' ? 'bg-primary text-white' : ''}`} onClick={() => toggleStatus('Completed')}>Completed</button>
        </div>
      </div>

      {/* Priority Section */}
      <div className="w-100 mt-5">
        <h4 className="text-white text-center mb-3 fw-bold">Priority Levels</h4>
        <div className="d-flex flex-column gap-3">
          <button className={`btn btn-outline-danger fs-5 ${priority === 'High' ? 'bg-danger text-white' : ''}`} onClick={() => togglePriority('High')}>High</button>
          <button className={`btn btn-outline-warning fs-5 ${priority === 'Medium' ? 'bg-warning text-white' : ''}`} onClick={() => togglePriority('Medium')}>Medium</button>
          <button className={`btn btn-outline-info fs-5 ${priority === 'Low' ? 'bg-info text-white' : ''}`} onClick={() => togglePriority('Low')}>Low</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;