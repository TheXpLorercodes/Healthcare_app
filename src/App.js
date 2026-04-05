// src/App.js
import React, { useState } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import FormPage from "./pages/FormPage";
import ChatbotPage from "./pages/ChatbotPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [page, setPage]         = useState("form");
  const [dashRefresh, setDashRefresh] = useState(0);

  // When a form is submitted, bump the dashboard refresh counter
  const handleSubmitted = () => setDashRefresh(r => r + 1);

  return (
    <div className="app-shell">
      <Sidebar active={page} setActive={setPage} />
      <main className="main-content">
        {page === "form"      && <FormPage onSubmitted={handleSubmitted} />}
        {page === "chatbot"   && <ChatbotPage />}
        {page === "dashboard" && <DashboardPage refresh={dashRefresh} />}
      </main>
    </div>
  );
}
