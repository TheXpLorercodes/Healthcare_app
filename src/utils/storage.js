// src/utils/storage.js
// Simple localStorage wrapper for persisting form submissions

const KEY = "medicare_submissions";

export function getSubmissions() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return raw.map(entry => ({
      ...entry,
      urgency: entry.role === "patient" ? (entry.urgency || "medium") : "",
    }));
  } catch {
    return [];
  }
}

export function saveSubmission(entry) {
  const all = getSubmissions();
  const normalizedEntry = {
    ...entry,
    urgency: entry.role === "patient" ? (entry.urgency || "medium") : "",
    department: entry.role === "patient" ? entry.department : "",
    age: entry.role === "patient" ? entry.age : "",
    gender: entry.role === "patient" ? entry.gender : "",
    skills: entry.role === "volunteer" ? entry.skills : "",
    availability: entry.role === "volunteer" ? entry.availability : "",
    subject: entry.role === "contact" ? entry.subject : "",
  };
  const newEntry = {
    ...normalizedEntry,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  };
  all.unshift(newEntry); // newest first
  localStorage.setItem(KEY, JSON.stringify(all));
  return newEntry;
}

export function clearSubmissions() {
  localStorage.removeItem(KEY);
}

export function getStats(submissions) {
  const total = submissions.length;
  const patients   = submissions.filter(s => s.role === "patient").length;
  const volunteers = submissions.filter(s => s.role === "volunteer").length;
  const contacts   = submissions.filter(s => s.role === "contact").length;

  const urgencyMap = { high: 0, medium: 0, low: 0 };
  submissions.forEach(s => {
    if (s.role === "patient" && s.urgency) {
      urgencyMap[s.urgency] = (urgencyMap[s.urgency] || 0) + 1;
    }
  });

  const departments = {};
  submissions.forEach(s => {
    if (s.department) departments[s.department] = (departments[s.department] || 0) + 1;
  });

  const topDept = Object.entries(departments).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return { total, patients, volunteers, contacts, urgencyMap, topDept };
}
