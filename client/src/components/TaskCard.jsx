import React, { useState } from "react";
import { FiCalendar, FiMoreVertical, FiEdit, FiTrash, FiCheckCircle, FiPlayCircle, FiClock } from "react-icons/fi";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityClass = (priority) => {
    return `badge ${priority.toLowerCase()}`;
  };

  const getStatusClass = (status) => {
    return `badge ${status.toLowerCase().replace(" ", "-")}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isUrgent = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  };

  const getUrgencyText = (dateStr) => {
    if (!dateStr) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Overdue";
    return `${diffDays} days left`;
  };

  return (
    <div className="task-card" onClick={() => onEdit(task)}>
      <div className="card-top">
        <span className={getPriorityClass(task.priority)}>{task.priority}</span>
        <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
          <button className="context-menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <FiMoreVertical />
          </button>
          {showMenu && (
            <div
              className="card-panel"
              style={{
                position: "absolute",
                top: "24px",
                right: "0",
                zIndex: "10",
                padding: "8px",
                margin: "0",
                width: "160px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                boxShadow: "var(--shadow-lg)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <button
                className="nav-item"
                style={{ width: "100%", border: "none", background: "none", textAlign: "left", padding: "6px 8px" }}
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
              >
                <FiEdit size={14} />
                <span style={{ fontSize: "12px" }}>Edit Task</span>
              </button>
              
              {task.status !== "Completed" && onStatusChange && (
                <button
                  className="nav-item"
                  style={{ width: "100%", border: "none", background: "none", textAlign: "left", padding: "6px 8px" }}
                  onClick={() => {
                    onStatusChange(task._id, "Completed");
                    setShowMenu(false);
                  }}
                >
                  <FiCheckCircle size={14} style={{ color: "var(--success)" }} />
                  <span style={{ fontSize: "12px" }}>Mark Done</span>
                </button>
              )}

              {task.status === "Pending" && onStatusChange && (
                <button
                  className="nav-item"
                  style={{ width: "100%", border: "none", background: "none", textAlign: "left", padding: "6px 8px" }}
                  onClick={() => {
                    onStatusChange(task._id, "In Progress");
                    setShowMenu(false);
                  }}
                >
                  <FiPlayCircle size={14} style={{ color: "var(--primary)" }} />
                  <span style={{ fontSize: "12px" }}>Start Task</span>
                </button>
              )}

              <button
                className="nav-item"
                style={{
                  width: "100%",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  padding: "6px 8px",
                  color: "var(--error-text)",
                }}
                onClick={() => {
                  onDelete(task._id);
                  setShowMenu(false);
                }}
              >
                <FiTrash size={14} />
                <span style={{ fontSize: "12px" }}>Delete Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="card-title">{task.title}</h3>
      <p className="card-desc">{task.description || "No description provided."}</p>

      <div className="card-meta">
        <div className={`card-date ${isUrgent(task.dueDate) && task.status !== "Completed" ? "urgent" : ""}`}>
          {isUrgent(task.dueDate) && task.status !== "Completed" ? <FiClock /> : <FiCalendar />}
          <span>{formatDate(task.dueDate)}</span>
          {task.status !== "Completed" && (
            <span style={{ opacity: 0.8, fontSize: "10px" }}>
              • {getUrgencyText(task.dueDate)}
            </span>
          )}
        </div>
        <div className="card-avatars">
          <div className="card-avatar" title="Unassigned">U</div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
