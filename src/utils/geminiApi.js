// src/utils/geminiApi.js
// Wrapper around Google Gemini API (FREE tier — no credit card needed)
// Get your free key at: https://aistudio.google.com/app/apikey

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

/**
 * Send a message to Gemini and get a response.
 * @param {Array} messages - Array of {role, content} objects
 * @param {string} systemPrompt - System-level instruction for Gemini
 * @returns {Promise<string>} - Gemini's text response
 */
export async function askAI(messages, systemPrompt = "") {
  if (!API_KEY || API_KEY === "your_gemini_api_key_here") {
    // Demo mode — smart mock responses when no key is set
    return normalizeAIText(getMockResponse(messages[messages.length - 1]?.content || ""));
  }

  // Convert messages to Gemini format
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    contents,
    systemInstruction: systemPrompt
      ? { parts: [{ text: systemPrompt }] }
      : undefined,
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.7,
    },
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Gemini API error ${response.status}`
    );
  }

  const data = await response.json();
  return normalizeAIText(
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I could not generate a response."
  );
}

function normalizeAIText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/[\u00A0\u202F]/g, " ")
    .trim();
}

/**
 * Demo responses when no API key is configured.
 * These are shown automatically — no key needed to test the UI.
 */
function getMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes("generate an acknowledgement for this submission:")) {
    if (msg.includes('volunteer "')) {
      const volunteerMatch = userMessage.match(/Volunteer "([^"]+)"/i);
      const name = volunteerMatch?.[1] || "there";
      return `Thank you for your volunteer support, ${name}. We appreciate your willingness to help and our team will review your details soon.`;
    }

    if (msg.includes('patient "')) {
      const patientMatch = userMessage.match(/Patient "([^"]+)"/i);
      const urgencyMatch = userMessage.match(/Urgency:\s*([^.]+)/i);
      const name = patientMatch?.[1] || "there";
      const urgency = urgencyMatch?.[1]?.trim() || "medium";
      return `Thank you for registering, ${name}. Based on the ${urgency} urgency of your request, we will be helping you soon and our team will review your support request promptly.`;
    }

    if (msg.includes('contact form from "')) {
      const contactMatch = userMessage.match(/Contact form from "([^"]+)"/i);
      const name = contactMatch?.[1] || "there";
      return `Thank you for reaching out, ${name}. If you know anyone who would like to volunteer, we would be happy if you told them to volunteer with us.`;
    }
  }

  if (msg.includes("appointment") || msg.includes("book"))
    return "To book an appointment, please fill out the Patient Support form on this portal. Our team will contact you within 24 hours to confirm a suitable time. You can also call our helpline at 1800-MED-HELP.";
  if (msg.includes("volunteer"))
    return "We welcome volunteers! Please fill out the Volunteer Registration form. We need help with patient transport, administrative support, and community outreach. Training is provided for all roles.";
  if (msg.includes("emergency") || msg.includes("urgent"))
    return "🚨 For medical emergencies, please call 112 immediately. This portal is for non-emergency support only. If you are in distress, please contact emergency services right away.";
  if (msg.includes("cost") || msg.includes("fee") || msg.includes("free"))
    return "Many of our services are offered free of charge thanks to our NGO funding and volunteers. Some specialist consultations may have a nominal fee. Please submit a contact form and we'll clarify costs for your specific need.";
  if (msg.includes("location") || msg.includes("address") || msg.includes("where"))
    return "Our main center is located at 45 Health Avenue, Bhubaneswar, Odisha. We also have mobile health camps every Saturday. Check the Events section for camp locations near you.";
  return "Thank you for reaching out! I'm the MediCare Connect AI assistant powered by Gemini. I can help with appointments, volunteering, services, and general healthcare queries. Could you tell me more about what you need?";
}
