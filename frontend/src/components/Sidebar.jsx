import logo from "../assests/Logo.png";

const Sidebar = () => {
  return (
    <div className="p-4 vh-100 d-flex flex-column align-items-center">
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
          <button className="btn btn-outline-light fs-5">All Tasks</button>
          <button className="btn btn-outline-success fs-5">In Progress</button>
          <button className="btn btn-outline-primary fs-5">Completed</button>
        </div>
      </div>

      {/* Priority Section */}
      <div className="w-100 mt-5">
        <h4 className="text-white text-center mb-3 fw-bold">Priority Levels</h4>
        <div className="d-flex flex-column gap-3">
          <button className="btn btn-outline-danger fs-5">High</button>
          <button className="btn btn-outline-warning fs-5">Medium</button>
          <button className="btn btn-outline-info fs-5">Low</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;