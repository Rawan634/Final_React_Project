import { FaTasks } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../store/taskSlice";
import { useState, useEffect } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(inputValue.trim()));
    }, 300); 
    
    return () => clearTimeout(timer);
  }, [inputValue, dispatch]);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <FaTasks className="logo-icon" />
          <h1 className="logo-text fs-5">TaskFlow</h1>
        </div>
        
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;