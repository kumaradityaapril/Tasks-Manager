import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../services/api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import TaskList from "../components/TaskList";

import {
  FiSearch,
  FiPlay,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiCalendar,
  FiTrash2,
  FiAlertTriangle,
  FiCheckSquare
} from "react-icons/fi";
import { TbActivityHeartbeat } from "react-icons/tb";

const Home = () => {
  // App-level State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, tasks, important, completed, settings
  const [subTab, setSubTab] = useState("overview"); // overview, analytics, workspace (project board)
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({
    Pending: false,
    "In Progress": false,
    Completed: false,
  });
  const [selectedPriority, setSelectedPriority] = useState(""); // High, Medium, Low
  const [dueDateFilter, setDueDateFilter] = useState("");

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Quick Add State
  const [quickTitle, setQuickTitle] = useState("");
  const [quickDueDate, setQuickDueDate] = useState("");

  // User Settings Preferences
  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: true,
    darkMode: false,
    language: "English (US)",
  });

  // Fetch Tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      if (res.data && res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load tasks from server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Sync dark mode configuration with body class
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [settings.darkMode]);

  // Sidebar shortcut filter presets handler
  const setFilterPreset = (preset) => {
    if (preset === "high-priority") {
      setSelectedPriority("High");
      setSelectedStatus({ Pending: true, "In Progress": true, Completed: false });
    } else if (preset === "status-completed") {
      setSelectedPriority("");
      setSelectedStatus({ Pending: false, "In Progress": false, Completed: true });
    } else {
      // Clear preset filters when regular tabs are clicked
      setSelectedPriority("");
      setSelectedStatus({ Pending: false, "In Progress": false, Completed: false });
    }
    setSearchQuery("");
    setDueDateFilter("");
  };

  // CRUD API Handlers
  const handleCreateOrUpdateTask = async (data) => {
    try {
      if (taskToEdit) {
        // Update task
        const res = await API.put(`/tasks/${taskToEdit._id}`, data);
        if (res.data.success) {
          toast.success("Task updated successfully!");
          setTasks(tasks.map((t) => (t._id === taskToEdit._id ? res.data.data : t)));
        }
      } else {
        // Create task
        const res = await API.post("/tasks", data);
        if (res.data.success) {
          toast.success("Task created successfully!");
          setTasks([res.data.data, ...tasks]);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save task.");
      console.error(err);
    } finally {
      setTaskToEdit(null);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await API.delete(`/tasks/${id}`);
      if (res.data.success) {
        toast.success("Task deleted successfully!");
        setTasks(tasks.filter((t) => t._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete task.");
      console.error(err);
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) {
      toast.warning("Please enter a task description.");
      return;
    }
    try {
      const res = await API.post("/tasks", {
        title: quickTitle,
        dueDate: quickDueDate || new Date(Date.now() + 86400000).toISOString().split("T")[0], // default tomorrow
        priority: "Medium",
        status: "Pending",
      });
      if (res.data.success) {
        toast.success("Quick task created!");
        setTasks([res.data.data, ...tasks]);
        setQuickTitle("");
        setQuickDueDate("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await API.put(`/tasks/${id}`, { status: newStatus });
      if (res.data.success) {
        setTasks(tasks.map((t) => (t._id === id ? res.data.data : t)));
        toast.info(`Task status updated to ${newStatus}`);
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  // Helper Stats Calculations
  const totalTasksCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status !== "Completed").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const efficiencyRate = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;
  
  // Overdue count
  const overdueCount = tasks.filter((t) => {
    if (t.status === "Completed" || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date().setHours(0,0,0,0);
  }).length;

  // Filter Tasks list for pages
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      // Search matches
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status matches
      const activeStatuses = Object.keys(selectedStatus).filter((k) => selectedStatus[k]);
      const matchesStatus = activeStatuses.length === 0 || activeStatuses.includes(task.status);

      // Priority matches
      const matchesPriority = !selectedPriority || task.priority === selectedPriority;

      // Due date matches
      let matchesDate = true;
      if (dueDateFilter) {
        const tDate = new Date(task.dueDate).toISOString().split("T")[0];
        matchesDate = tDate === dueDateFilter;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });
  };

  const filteredTasks = getFilteredTasks();

  // Graph weekly values (real-time task counts grouped by due date's day of week)
  const getWeekBarHeight = (dayIndex) => {
    // Map dayIndex (0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat)
    // In JavaScript Date.getDay(), Sunday is 0, Monday is 1, ... Saturday is 6.
    const targetDayOfWeek = dayIndex + 1; 

    const count = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const day = new Date(t.dueDate).getDay();
      return day === targetDayOfWeek;
    }).length;

    if (totalTasksCount === 0) return "8%"; // Default mini height for empty charts

    // Find the max tasks due on any single day of the week to scale relatively
    const counts = [1, 2, 3, 4, 5, 6].map((d) => 
      tasks.filter((t) => t.dueDate && new Date(t.dueDate).getDay() === d).length
    );
    const maxCount = Math.max(...counts, 1);

    const percentage = Math.max((count / maxCount) * 80, 8); // scale with max height of 80%
    return `${percentage}%`;
  };

  // Upcoming tasks lists (sorted by due dates, pending first)
  const upcomingTasks = tasks
    .filter((t) => t.status !== "Completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  // Settings modification
  const handleSettingToggle = (field) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "dashboard") setSubTab("overview");
          if (tab === "important" || tab === "completed") {
            setActiveTab("tasks");
          }
        }}
        onOpenModal={() => {
          setTaskToEdit(null);
          setIsModalOpen(true);
        }}
        setFilterPreset={setFilterPreset}
      />

      <main className="main-content">
        {/* TOP BAR */}
        <header className="top-bar">
          <div className="search-box">
            <FiSearch className="text-secondary" />
            <input
              type="text"
              placeholder="Search tasks, teams, documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === "dashboard" && (
            <div className="top-tabs">
              <span
                className={`top-tab ${subTab === "overview" ? "active" : ""}`}
                onClick={() => setSubTab("overview")}
              >
                Dashboard
              </span>
              <span
                className={`top-tab ${subTab === "analytics" ? "active" : ""}`}
                onClick={() => setSubTab("analytics")}
              >
                Analytics
              </span>
              <span
                className={`top-tab ${subTab === "workspace" ? "active" : ""}`}
                onClick={() => setSubTab("workspace")}
              >
                Project Board
              </span>
            </div>
          )}
        </header>

        {/* MAIN DISPLAY CONTAINER */}
        <div className="view-container">
          {/* VIEW: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && subTab === "overview" && (
            <div>
              {/* Stats Grid */}
              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Total Tasks</span>
                    <span className="stat-val">{totalTasksCount}</span>
                    <span className="stat-trend positive">↗ +12% from last week</span>
                  </div>
                  <div className="stat-icon">
                    <FiCheckSquare />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Pending</span>
                    <span className="stat-val">{pendingCount}</span>
                    <span className="stat-trend negative" style={{ color: "var(--error)" }}>
                      ⚠ {overdueCount} overdue items
                    </span>
                  </div>
                  <div className="stat-icon red">
                    <FiClock />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Completed</span>
                    <span className="stat-val">{completedCount}</span>
                    <span className="stat-trend positive">✓ High efficiency rate</span>
                  </div>
                  <div className="stat-icon green">
                    <FiCheckCircle />
                  </div>
                </div>
              </section>

              {/* Main Content Layout splits */}
              <div className="dashboard-layout">
                <div className="dashboard-left">
                  {/* Quick Add Card */}
                  <div className="card-panel">
                    <form className="quick-add" onSubmit={handleQuickAdd}>
                      <h2>
                        <TbActivityHeartbeat style={{ color: "var(--primary)" }} />
                        <span>Quick Add Task</span>
                      </h2>
                      <div className="quick-add-form">
                        <input
                          type="text"
                          placeholder="What needs to be done?"
                          value={quickTitle}
                          onChange={(e) => setQuickTitle(e.target.value)}
                        />
                        <div className="btn-due-selector">
                          <FiCalendar />
                          <input
                            type="date"
                            value={quickDueDate}
                            onChange={(e) => setQuickDueDate(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn-primary">
                          Create
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Upcoming Deadlines */}
                  <div className="card-panel">
                    <div className="panel-header">
                      <h2>Upcoming Deadlines</h2>
                      <a href="#all" onClick={() => setActiveTab("tasks")}>
                        View All Tasks
                      </a>
                    </div>
                    {upcomingTasks.length === 0 ? (
                      <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "16px" }}>
                        No upcoming deadlines. Excellent work!
                      </p>
                    ) : (
                      <div className="upcoming-grid">
                        {upcomingTasks.slice(0, 2).map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={(t) => {
                              setTaskToEdit(t);
                              setIsModalOpen(true);
                            }}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    )}
                    {upcomingTasks.length > 2 && (
                      <div className="upcoming-full-width">
                        <div
                          className="task-card"
                          style={{ flexDirection: "row", alignItems: "center" }}
                          onClick={() => {
                            setTaskToEdit(upcomingTasks[2]);
                            setIsModalOpen(true);
                          }}
                        >
                          <div style={{ flexGrow: 1 }}>
                            <span className="badge normal">{upcomingTasks[2].priority}</span>
                            <h4 style={{ margin: "4px 0", fontSize: "14px" }}>{upcomingTasks[2].title}</h4>
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              Due: {new Date(upcomingTasks[2].dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            className="btn-primary"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(upcomingTasks[2]._id, "Completed");
                            }}
                          >
                            Mark Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DASHBOARD - ANALYTICS TAB */}
          {activeTab === "dashboard" && subTab === "analytics" && (
            <div className="card-panel" style={{ textAlign: "center", padding: "64px" }}>
              <div style={{ fontSize: "48px", color: "var(--primary)", marginBottom: "16px" }}>📈</div>
              <h2>Analytics & Performance</h2>
              <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "12px auto 24px" }}>
                Analyze completion patterns, project velocities, and workload allocations across teams.
              </p>
              <div style={{ display: "inline-flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
                <div className="stat-card" style={{ width: "200px" }}>
                  <div className="stat-info">
                    <span className="stat-label">Efficiency Rate</span>
                    <span className="stat-val">{efficiencyRate}%</span>
                  </div>
                </div>
                <div className="stat-card" style={{ width: "200px" }}>
                  <div className="stat-info">
                    <span className="stat-label">Tasks Completed</span>
                    <span className="stat-val">{completedCount}</span>
                  </div>
                </div>
                <div className="stat-card" style={{ width: "200px" }}>
                  <div className="stat-info">
                    <span className="stat-label">Avg. Lead Time</span>
                    <span className="stat-val">2.4d</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: KANBAN BOARD VIEW (Project Board tab or Workspace option) */}
          {activeTab === "dashboard" && subTab === "workspace" && (
            <div>
              <div className="page-header" style={{ marginBottom: "12px" }}>
                <div className="page-title">
                  <h1>Workspace Overview</h1>
                  <p>Manage and track project milestones</p>
                </div>
              </div>
              <div className="kanban-board">
                {["Pending", "In Progress", "Completed"].map((status) => {
                  const columnTasks = tasks.filter((t) => t.status === status);
                  return (
                    <div className="kanban-column" key={status}>
                      <div className="column-header">
                        <h3>
                          {status === "Pending" && <FiClock />}
                          {status === "In Progress" && <FiPlay style={{ color: "var(--primary)" }} />}
                          {status === "Completed" && <FiCheckCircle style={{ color: "var(--success)" }} />}
                          <span>{status}</span>
                        </h3>
                        <span className="column-count">{columnTasks.length}</span>
                      </div>
                      <div className="column-tasks">
                        {columnTasks.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={(t) => {
                              setTaskToEdit(t);
                              setIsModalOpen(true);
                            }}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: ALL TASKS */}
          {activeTab === "tasks" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>All Tasks</h1>
                  <p>Manage and track your team's progress across all active projects.</p>
                </div>
                <div className="header-buttons">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      // Simulating CSV Export
                      const headers = ["Title", "Description", "Status", "Priority", "Due Date"];
                      const csvContent = [
                        headers.join(","),
                        ...tasks.map((t) =>
                          [t.title, t.description || "", t.status, t.priority, t.dueDate || ""].join(",")
                        ),
                      ].join("\n");
                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.setAttribute("href", url);
                      link.setAttribute("download", "tasks_export.csv");
                      link.click();
                      toast.success("CSV file downloaded!");
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setTaskToEdit(null);
                      setIsModalOpen(true);
                    }}
                  >
                    + Add New Task
                  </button>
                </div>
              </div>

              <div className="tasks-layout">
                {/* Filters Panel */}
                <aside className="filters-sidebar">
                  <div className="card-panel" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="panel-header" style={{ marginBottom: "0", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                      <h2 style={{ fontSize: "14px" }}>FILTERS</h2>
                    </div>

                    <div className="filter-section">
                      <h3>Status</h3>
                      <div className="checkbox-group">
                        {["Pending", "In Progress", "Completed"].map((status) => (
                          <label className="checkbox-label" key={status}>
                            <input
                              type="checkbox"
                              checked={selectedStatus[status]}
                              onChange={() =>
                                setSelectedStatus({ ...selectedStatus, [status]: !selectedStatus[status] })
                              }
                            />
                            <span>{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="filter-section">
                      <h3>Priority</h3>
                      <div className="priority-toggle-group">
                        {["High", "Medium", "Low"].map((priority) => (
                          <button
                            key={priority}
                            className={`priority-toggle-btn ${selectedPriority === priority ? "active" : ""}`}
                            onClick={() => setSelectedPriority(selectedPriority === priority ? "" : priority)}
                          >
                            {priority.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="filter-section">
                      <h3>Due Date</h3>
                      <input
                        type="date"
                        className="select-dropdown"
                        style={{ width: "100%" }}
                        value={dueDateFilter}
                        onChange={(e) => setDueDateFilter(e.target.value)}
                      />
                    </div>

                    <button
                      className="btn-clear-filters"
                      onClick={() => {
                        setSelectedStatus({ Pending: false, "In Progress": false, Completed: false });
                        setSelectedPriority("");
                        setDueDateFilter("");
                      }}
                    >
                      Clear all filters
                    </button>
                  </div>

                  <div className="efficiency-card">
                    <span className="efficiency-card-label">EFFICIENCY RATE</span>
                    <span className="efficiency-card-val">{efficiencyRate}%</span>
                    <span className="efficiency-card-desc">Higher than last month. Keep it up!</span>
                  </div>
                </aside>

                {/* Table Panel */}
                <div style={{ flexGrow: 1 }}>
                  <TaskList
                    tasks={filteredTasks}
                    onEdit={(t) => {
                      setTaskToEdit(t);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE/EDIT TASK MODAL DIALOG */}
      <TaskForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmitTask={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
      />

      <ToastContainer position="bottom-right" autoClose={3000} theme={settings.darkMode ? "dark" : "light"} />
    </div>
  );
};

export default Home;
