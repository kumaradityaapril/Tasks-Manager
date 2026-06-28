import React, { useState } from "react";
import {
  FiFileText,
  FiCloud,
  FiCpu,
  FiVolume2,
  FiUsers,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getTaskIcon = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("audit") || t.includes("financial") || t.includes("report") || t.includes("document")) {
      return <FiFileText />;
    }
    if (t.includes("server") || t.includes("migration") || t.includes("cloud") || t.includes("database") || t.includes("api")) {
      return <FiCloud />;
    }
    if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("app") || t.includes("mobile")) {
      return <FiCpu />;
    }
    if (t.includes("seo") || t.includes("marketing") || t.includes("ads") || t.includes("campaign")) {
      return <FiVolume2 />;
    }
    if (t.includes("workshop") || t.includes("meeting") || t.includes("team") || t.includes("stakeholder")) {
      return <FiUsers />;
    }
    return <FiCheckSquare />;
  };

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

  const getUrgencyText = (dateStr, status) => {
    if (status === "Completed") return { text: "Done", class: "done-text" };
    if (!dateStr) return { text: "", class: "" };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: "Today", class: "urgent-text" };
    if (diffDays === 1) return { text: "Tomorrow", class: "urgent-text" };
    if (diffDays < 0) return { text: "Overdue", class: "urgent-text" };
    return { text: `${diffDays} days left`, class: "normal-text" };
  };

  // Pagination logic
  const totalItems = tasks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = tasks.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="tasks-main">
      <div className="table-responsive">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "var(--text-secondary)" }}>
                  No tasks found matching current filters.
                </td>
              </tr>
            ) : (
              paginatedTasks.map((task) => {
                const urgency = getUrgencyText(task.dueDate, task.status);
                return (
                  <tr key={task._id}>
                    <td>
                      <div className="task-name-cell">
                        <div className="task-icon">{getTaskIcon(task.title)}</div>
                        <div className="task-title-info">
                          <span className="task-table-title">{task.title}</span>
                          <span className="task-table-project">
                            {task.description ? task.description.slice(0, 40) + (task.description.length > 40 ? "..." : "") : "No Project details"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                        className={getStatusClass(task.status)}
                        style={{ border: "none", cursor: "pointer", outline: "none", padding: "4px 8px" }}
                      >
                        <option value="Pending" style={{ color: "var(--text-primary)", background: "var(--surface)" }}>Pending</option>
                        <option value="In Progress" style={{ color: "var(--text-primary)", background: "var(--surface)" }}>In Progress</option>
                        <option value="Completed" style={{ color: "var(--text-primary)", background: "var(--surface)" }}>Completed</option>
                      </select>
                    </td>
                    <td>
                      <span className={getPriorityClass(task.priority)}>{task.priority}</span>
                    </td>
                    <td>
                      <div className="task-title-info">
                        <span>{formatDate(task.dueDate)}</span>
                        {urgency.text && (
                          <span
                            className={urgency.class}
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color:
                                urgency.class === "urgent-text"
                                  ? "var(--error)"
                                  : urgency.class === "done-text"
                                  ? "var(--primary)"
                                  : "var(--text-secondary)",
                            }}
                          >
                            {urgency.text}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button className="icon-btn" onClick={() => onEdit(task)} title="Edit Task">
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => onDelete(task._id)}
                          style={{ color: "var(--error)" }}
                          title="Delete Task"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-footer">
          <span className="table-footer-info">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} tasks
          </span>
          <div className="pagination">
            <button className="page-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
              <FiChevronLeft />
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button className="page-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
