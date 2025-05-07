import { FaTasks, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../store/taskSlice";
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Header = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tasks = useSelector((state) => state.tasks.tasks);
  const [tasksByDate, setTasksByDate] = useState({});

  // Group tasks by date
  useEffect(() => {
    const groupedTasks = {};
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = new Date(task.dueDate).toDateString();
        if (!groupedTasks[dateKey]) {
          groupedTasks[dateKey] = [];
        }
        groupedTasks[dateKey].push(task);
      }
    });
    
    setTasksByDate(groupedTasks);
  }, [tasks]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(inputValue.trim()));
    }, 300); 
    
    return () => clearTimeout(timer);
  }, [inputValue, dispatch]);

  // Calendar tile content
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = date.toDateString();
      const dateTasks = tasksByDate[dateKey] || [];
      
      return (
        <div className="calendar-tasks">
          {dateTasks.slice(0, 3).map(task => (
            <div key={task._id} className={`calendar-task ${task.priority.toLowerCase()}`}>
              {task.title}
            </div>
          ))}
          {dateTasks.length > 3 && (
            <div className="calendar-more-tasks">
              +{dateTasks.length - 3} more
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <FaTasks className="logo-icon" />
          <h1 className="logo-text fs-5">Taskly</h1>
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

        {/* Enhanced Calendar Button */}
        <div className="header-calendar-container">
          <button 
            className="calendar-button active"
            onClick={() => setIsCalendarOpen(true)}
            aria-label="Open calendar"
          >
            <FaCalendarAlt size={20} />
            <span className="calendar-button-badge">
              {Object.keys(tasksByDate).length}
            </span>
          </button>
        </div>
      </div>

      {/* Enhanced Calendar Modal */}
      {isCalendarOpen && (
        <div className="calendar-modal-overlay" onClick={() => setIsCalendarOpen(false)}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-modal-header">
              <h3 className="calendar-title">Task Calendar</h3>
              <button 
                className="calendar-close-button" 
                onClick={() => setIsCalendarOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="calendar-container">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                className="custom-calendar"
              />
            </div>

            <div className="calendar-task-list">
              <h4 className="task-list-title">
                Tasks for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              {tasksByDate[selectedDate.toDateString()]?.length > 0 ? (
                <ul className="task-list">
                  {tasksByDate[selectedDate.toDateString()].map(task => (
                    <li key={task._id} className="calendar-task-item">
                      <div className="task-info">
                        <span className="task-title">{task.title}</span>
                        <span className="task-status">{task.status}</span>
                      </div>
                      <span 
                        className={`task-priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-tasks">
                  <div className="no-tasks-icon">📅</div>
                  <p>No tasks scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;