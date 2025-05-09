import { useSelector, useDispatch } from 'react-redux';
import TaskCard from './Taskcard';
import { FaSpinner, FaExclamationTriangle, FaSadTear, FaStar } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { fetchTasksFromDB, updateTaskInDB } from '../store/taskSlice';

const TaskBoard = ({ priorityFilter, favoritesFilter }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);
  const searchQuery = useSelector((state) => state.tasks.searchQuery);
  const [draggedTask, setDraggedTask] = useState(null);

  // Fetch tasks on component 
  useEffect(() => {
    dispatch(fetchTasksFromDB());
  }, [dispatch]);

  // Filter tasks based on priority, favorites, and search
  // In the filter function, add null checks:
  // Update your filteredTasks calculation to include null checks:
const filteredTasks = (tasks || []).filter(task => {
  const matchesPriority = priorityFilter ? task?.priority === priorityFilter : true;
  const matchesFavorites = favoritesFilter ? task?.favorite === true : true;
  const matchesSearch = searchQuery ? 
    (task?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) : true;
  
  return matchesPriority && matchesFavorites && matchesSearch;
});

  // Categorize tasks by status
  const pendingTasks = filteredTasks.filter(task => task.status === "Pending");
  const inProgressTasks = filteredTasks.filter(task => task.status === "In Progress");
  const completedTasks = filteredTasks.filter(task => task.status === "Completed");

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTaskUpdate = (taskId, updatedTask) => {
    dispatch(updateTaskInDB({
      taskId,
      updatedTask,
      originalTask: tasks.find(t => t._id === taskId)
    }));
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (status) => {
  if (draggedTask && draggedTask.status !== status) {
    try {
      const updatedTask = { ...draggedTask, status };
      await dispatch(updateTaskInDB({
        taskId: draggedTask._id,
        updatedTask,
        originalTask: draggedTask
      })).unwrap();
      
    } catch (error) {
      console.error("Drop failed:", error);
    } finally {
      setDraggedTask(null);
    }
  }
};
  if (loading) {
    return (
      <div className="text-center w-100 mt-5">
        <FaSpinner className="fa-spin text-primary" size={40} />
        <p className="mt-2 text-muted">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center w-100 mt-5">
        <FaExclamationTriangle className="text-danger" size={40} />
        <p className="mt-2 text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="task-board-container p-3 flex-grow-1 d-flex flex-column">
      {/* Filter Indicator */}
      {(priorityFilter || favoritesFilter) && (
        <div className="filter-indicator mb-3 p-2 d-flex align-items-center">
          <span className="me-2">Active Filters:</span>
          {priorityFilter && (
            <span className={`filter-badge priority-${priorityFilter.toLowerCase()}`}>
              {priorityFilter} Priority
            </span>
          )}
          {favoritesFilter && (
            <span className="filter-badge favorites">
              <FaStar className="me-1" /> Favorites Only
            </span>
          )}
        </div>
      )}
      
      <div className="kanban-board flex-grow-1 d-flex gap-3 overflow-auto">
        {/* Pending Column */}
        <div 
          className="kanban-column flex-grow-1"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("Pending")}
        >
          <div className="column-header pending text-black p-3 rounded-top">
            <h5 className="m-0">⏳ Pending ({pendingTasks.length})</h5>
          </div>
          <div className="column-content p-2 bg-light rounded-bottom h-100">
            {pendingTasks.length > 0 ? (
              pendingTasks.map(task => (
                <TaskCard 
                key={task.isOptimistic ? `opt-${task._id}` : task._id}
                task={task} 
                onDragStart={handleDragStart}
                onUpdate={handleTaskUpdate}
              />
              ))
            ) : (
              <div className="text-center text-muted p-3"><FaSadTear /><p>No pending tasks</p></div>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div 
          className="kanban-column flex-grow-1"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("In Progress")}
        >
          <div className="column-header in-progress text-black p-3 rounded-top">
            <h5 className="m-0">⚒️ In Progress ({inProgressTasks.length})</h5>
          </div>
          <div className="column-content p-2 bg-light rounded-bottom h-100">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onDragStart={handleDragStart}
                  onUpdate={handleTaskUpdate}
                />
              ))
            ) : (
              <div className="text-center text-muted p-3"><FaSadTear /><p>No tasks in progress</p></div>
            )}
          </div>
        </div>

        {/* Completed Column */}
        <div 
          className="kanban-column flex-grow-1"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("Completed")}
        >
          <div className="column-header completed text-black p-3 rounded-top">
            <h5 className="m-0">✅ Completed ({completedTasks.length})</h5>
          </div>
          <div className="column-content p-2 bg-light rounded-bottom h-100">
            {completedTasks.length > 0 ? (
              completedTasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onDragStart={handleDragStart}
                  onUpdate={handleTaskUpdate}
                />
              ))
            ) : (
              <div className="text-center text-muted p-3"><FaSadTear /><p>No completed tasks</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;