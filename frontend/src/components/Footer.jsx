const Footer = () => {
  return (
    <div className="bg-primary text-white text-center p-4 rounded-4 d-flex justify-content-center gap-5">
      <button className="btn btn-light text-primary fw-bold px-4 py-2 fs-5">➕ Add Task</button>
      <button className="btn btn-danger fw-bold px-4 py-2 fs-5">🗑️ Delete All</button>
    </div>
  );
};

export default Footer;
