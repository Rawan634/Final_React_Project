import { FaTasks } from "react-icons/fa"; 
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../store/taskSlice";
import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(""); 

  const handleSearch = () => {
    dispatch(setSearchQuery(inputValue.trim())); 
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value); 
    if (e.target.value === "") {
      dispatch(setSearchQuery(""));
    }
  };

  return (
    <div className="text-white p-4 rounded-4 header" style={{ backgroundColor: "#212529"}}>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="d-flex align-items-center">
          <FaTasks className="me-2" /> Task Manager </h4>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={inputValue}
            onChange={handleInputChange} 
          />
          <button className="btn btn-light" onClick={handleSearch}>
            🔍
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
