// src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from "react";
import { Users, Heart, UserCheck, MessageSquare, Sparkles, RefreshCw, Loader, Trash2 } from "lucide-react";
import { getSubmissions, getStats, clearSubmissions } from "../utils/storage";
import { askAI } from "../utils/geminiApi";

const SUMMARY_PROMPT = `You are a healthcare NGO data analyst. 
Given submission statistics, write a concise 3-4 sentence operational summary for NGO staff. 
Highlight: total workload, urgent cases if any, volunteer availability, and one actionable recommendation. 
Be professional and data-driven. Do not use bullet points — write in flowing prose.`;

function formatSummaryText(text) {
  return String(text || "")
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/([.!?])\s+/g, "$1\n")
    .trim();
}

export default function DashboardPage({ refresh }) {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats]             = useState(null);
  const [summary, setSummary]         = useState("");
  const [loadingAI, setLoadingAI]     = useState(false);

  const load = useCallback(() => {
    const s = getSubmissions();
    setSubmissions(s);
    setStats(getStats(s));
    setSummary(""); // reset summary on reload
  }, []);

  useEffect(() => { load(); }, [load, refresh]);

  const generateSummary = async () => {
    if (!stats) return;
    setLoadingAI(true);
    const prompt = `
      Total submissions: ${stats.total}
      Patients: ${stats.patients}, Volunteers: ${stats.volunteers}, Contact forms: ${stats.contacts}
      Urgency breakdown — High: ${stats.urgencyMap.high}, Medium: ${stats.urgencyMap.medium}, Low: ${stats.urgencyMap.low}
      Most-requested department: ${stats.topDept}
    `;
    try {
      const reply = await askAI(
        [{ role: "user", content: `Summarise these NGO submission stats: ${prompt}` }],
        SUMMARY_PROMPT
      );
      setSummary(reply);
    } catch {
      setSummary("Unable to generate AI summary right now. Please check your API key or try again later.");
    }
    setLoadingAI(false);
  };

  const handleClear = () => {
    if (window.confirm("Clear all submission data? This cannot be undone.")) {
      clearSubmissions();
      load();
    }
  };

  const fmt = (iso) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  const formattedSummary = formatSummaryText(summary);

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Submissions Dashboard</h2>
          <p>Real-time overview of all patient, volunteer, and contact form entries.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={load} style={{ fontSize: 13 }}>
            <RefreshCw size={14} /> Refresh
          </button>
          {submissions.length > 0 && (
            <button className="btn" onClick={handleClear}
              style={{ background: "#FDE8E6", color: "var(--red)", border: "1.5px solid var(--red)", fontSize: 13 }}>
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={18} /></div>
          <div className="stat-value">{stats?.total ?? 0}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon"><Heart size={18} /></div>
          <div className="stat-value">{stats?.patients ?? 0}</div>
          <div className="stat-label">Patient Requests</div>
        </div>
        <div className="stat-card dark">
          <div className="stat-icon"><UserCheck size={18} /></div>
          <div className="stat-value">{stats?.volunteers ?? 0}</div>
          <div className="stat-label">Volunteers</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><MessageSquare size={18} /></div>
          <div className="stat-value">{stats?.urgencyMap?.high ?? 0}</div>
          <div className="stat-label">High Urgency</div>
        </div>
      </div>

      {/* ── AI Summary ── */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div className="card-title">AI Data Summary</div>
            <div className="card-sub" style={{ marginBottom: 0 }}>
              Click below to generate an intelligent operational summary of all submissions.
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={generateSummary}
            disabled={loadingAI || stats?.total === 0}
            style={{ flexShrink: 0 }}
          >
            {loadingAI
              ? <><Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> Analysing…</>
              : <><Sparkles size={15} /> Generate Summary</>
            }
          </button>
        </div>

        {summary ? (
          <div className="summary-box">
            <div className="summary-label"><Sparkles size={13} /> Medicare AI Analysis</div>
            <div className="summary-text" style={{ display: "block", width: "100%", maxWidth: "100%" }}>
              {formattedSummary.split("\n").map((line, index, lines) => (
                <div key={index} style={{ marginBottom: index === lines.length - 1 ? 0 : 8 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: "var(--bg)", border: "1.5px dashed var(--border)",
            borderRadius: 10, padding: "24px", textAlign: "center",
            color: "var(--ink-soft)", fontSize: 14
          }}>
            {stats?.total === 0
              ? "No submissions yet. Submit a form to see AI analysis here."
              : 'Click "Generate Summary" to get an AI-powered report of your submissions.'
            }
          </div>
        )}
      </div>

      {/* ── Submissions Table ── */}
      <div className="card">
        <div className="card-title">All Submissions</div>
        <div className="card-sub">
          {submissions.length === 0 ? "No submissions yet." : `${submissions.length} total record${submissions.length !== 1 ? "s" : ""}`}
        </div>

        {submissions.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th>Department / Subject</th>
                  <th>Urgency</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name || "—"}</strong></td>
                    <td>
                      <span className={`badge badge-${s.role}`}>
                        {s.role === "patient" ? "🏥 Patient" : s.role === "volunteer" ? "🤝 Volunteer" : "✉️ Contact"}
                      </span>
                    </td>
                    <td style={{ color: "var(--ink-soft)" }}>{s.email || "—"}</td>
                    <td>{s.department || s.subject || "—"}</td>
                    <td>
                      {s.role === "patient" && s.urgency ? (
                        <span style={{ fontSize: 12.5 }}>
                          {s.urgency === "high" ? "🔴 High" : s.urgency === "medium" ? "🟡 Medium" : "🟢 Low"}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ color: "var(--ink-soft)", fontSize: 12.5 }}>{fmt(s.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
