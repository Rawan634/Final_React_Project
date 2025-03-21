import { useDispatch } from "react-redux";
import { setSearchQuery } from "../store/taskSlice";
import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(""); // Local state for search input

  const handleSearch = () => {
    dispatch(setSearchQuery(inputValue.trim())); // Dispatch only on button click
  };

  return (
    <div className="bg-primary text-white p-4 rounded-4 header">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Task Manager</h4>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Update local state
          />
          <button className="btn btn-light" onClick={handleSearch}>
            🔍 Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
