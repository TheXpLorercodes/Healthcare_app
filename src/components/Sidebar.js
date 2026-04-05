// src/components/Sidebar.js
import React from "react";
import { ClipboardPlus, MessageSquare, LayoutDashboard, Heart } from "lucide-react";

const NAV = [
  { id: "form",      label: "Register / Contact", icon: ClipboardPlus },
  { id: "chatbot",   label: "AI Health Assistant",  icon: MessageSquare },
  { id: "dashboard", label: "Data Dashboard",       icon: LayoutDashboard },
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="cross">🏥</div>
        <h1>MediCare<br />Connect</h1>
        <span>NGO Health Portal</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-btn ${active === id ? "active" : ""}`}
            onClick={() => setActive(id)}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Heart size={12} style={{ display: "inline", marginRight: 5 }} />
        Serving communities since 2019
      </div>
    </aside>
  );
}
