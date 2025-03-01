const Header = () => {
    return (
      <div className="bg-primary text-white p-4 rounded-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>The title of the filter or status</h4>
          <div>
            <input type="text" className="form-control d-inline w-auto" placeholder="Search..." />
            <button className="btn btn-light ms-2">Search</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Header;
  