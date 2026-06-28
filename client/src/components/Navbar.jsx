import React from "react";
import { FiCheckCircle, FiStar, FiList, FiPlus } from "react-icons/fi";
import { TbLayoutDashboard } from "react-icons/tb";

const Navbar = ({ activeTab, setActiveTab, onOpenModal, setFilterPreset }) => {
  const handleNavClick = (tab, preset = null) => {
    setActiveTab(tab);
    if (setFilterPreset) {
      setFilterPreset(preset);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <TbLayoutDashboard style={{ marginRight: '8px' }} />
          <span>TaskPro</span>
        </div>


        <button className="btn-create-task" onClick={onOpenModal}>
          <FiPlus />
          <span>Create Task</span>
        </button>

        <ul className="nav-menu">
          <li>
            <button
              className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => handleNavClick("dashboard")}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
            >
              <TbLayoutDashboard />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === "tasks" ? "active" : ""}`}
              onClick={() => handleNavClick("tasks")}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
            >
              <FiList />
              <span>All Tasks</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === "important" ? "active" : ""}`}
              onClick={() => handleNavClick("important", "high-priority")}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
            >
              <FiStar />
              <span>Important</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => handleNavClick("completed", "status-completed")}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
            >
              <FiCheckCircle />
              <span>Completed</span>
            </button>
          </li>
        </ul>
      </div>

    </aside>
  );
};

export default Navbar;
