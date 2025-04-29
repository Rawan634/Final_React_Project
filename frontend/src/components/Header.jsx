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
    <div className="header p-3 bg-dark text-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="d-flex align-items-center m-0">
          <FaTasks className="me-2" /> TaskFlow
        </h4>
        <div className="d-flex gap-2 w-50">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search tasks..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className="btn btn-sm btn-light d-flex align-items-center"
            onClick={handleSearch}
          >
            <span className="d-none d-sm-inline">Search</span>
            <span className="d-sm-none">🔍</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;