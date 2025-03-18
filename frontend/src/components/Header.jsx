import { useState } from "react";

const Header = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery.trim()); // Call parent search function
  };

  return (
    <div className="bg-primary text-white p-4 rounded-4">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Task Manager</h4>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-light" onClick={handleSearch}>🔍 Search</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
