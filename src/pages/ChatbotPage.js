// src/pages/ChatbotPage.js
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { askAI } from "../utils/geminiApi";

const SYSTEM_PROMPT = `You are a compassionate, knowledgeable healthcare support assistant 
for MediCare Connect, a non-profit NGO in Odisha, India. 

Your role:
- Answer FAQs about our healthcare services, appointments, volunteering, and programs
- Provide general (non-diagnostic) health information in simple language
- Guide users to fill the right form on this portal (patient support, volunteer, or contact)
- Offer empathetic support for health-related concerns
- Escalate emergencies by telling users to call 112 immediately

Rules:
- Never diagnose medical conditions — always recommend consulting a doctor for specific symptoms
- Keep responses concise (under 100 words ideally)
- Be warm, simple, and avoid medical jargon
- If unsure, say so and suggest speaking with our staff via the contact form

Services offered by MediCare Connect: general medicine, cardiology, paediatrics, mental health, 
orthopaedics, gynaecology, dental, eye care. Free for BPL card holders, nominal fee for others.
Location: 45 Health Avenue, Bhubaneswar, Odisha. Helpline: 1800-MED-HELP. Open Mon-Sat 8am-6pm.`;

const QUICK_REPLIES = [
  "How do I book an appointment?",
  "Is treatment free?",
  "How can I volunteer?",
  "What services do you offer?",
  "Where are you located?",
  "I have a medical emergency",
];

const WELCOME = {
  role: "bot",
  text: "👋 Hello! I'm the MediCare Connect AI assistant. I can help with appointments, services, volunteering, and general health queries.\n\nHow can I help you today?",
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const [history, setHistory]   = useState([]); // Medicare AI message history
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    // Add user message to UI
    setMessages(m => [...m, { role: "user", text: userText }]);
    setInput("");
    setTyping(true);

    // Build history for Medicare AI (multi-turn)
    const newHistory = [...history, { role: "user", content: userText }];
    setHistory(newHistory);

    try {
      const reply = await askAI(newHistory, SYSTEM_PROMPT);
      setMessages(m => [...m, { role: "bot", text: reply }]);
      setHistory(h => [...h, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(m => [...m, {
        role: "bot",
        text: "Sorry, I'm having trouble connecting right now. Please try again or call our helpline: 1800-MED-HELP.",
      }]);
    }

    setTyping(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div>
      <div className="page-header">
        <h2>AI Health Assistant</h2>
        <p>Powered by Medicare AI — ask anything about our services, appointments, or health queries.</p>
      </div>

      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="bot-avatar">🤖</div>
          <div className="chat-header-info">
            <h3>MediCare Assistant</h3>
            <span>● Online — Responds instantly</span>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              <div className="msg-avatar">
                {msg.role === "bot" ? <Bot size={15} /> : <User size={15} />}
              </div>
              <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="msg bot">
              <div className="msg-avatar"><Bot size={15} /></div>
              <div className="msg-bubble">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick reply chips */}
        {messages.length <= 2 && (
          <div className="quick-replies">
            {QUICK_REPLIES.map(q => (
              <button key={q} className="quick-chip" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your question here…"
            disabled={typing}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={typing || !input.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
          ⚠️ <strong>Disclaimer:</strong> This AI assistant provides general health information only and is not a substitute for professional medical advice. For emergencies, call <strong>112</strong> immediately. Always consult a qualified doctor for diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}
