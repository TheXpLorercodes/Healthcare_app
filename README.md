# 🏥 MediCare Connect — Healthcare NGO Support Portal

A production-ready React web app built for healthcare NGOs, featuring patient/volunteer registration, an AI chatbot, and a live data dashboard with AI-generated summaries — all powered by the **Google Gemini API (100% free, no credit card)**.

---

## 🚀 Live Demo

> **Hosted Link:** *(Add your Vercel/Netlify URL here after deployment)*  
> **GitHub:** *(Add your repo URL here)*

---

## 📁 File Structure

```
healthcare-app/
├── public/
│   └── index.html                  # HTML shell with Google Fonts
├── src/
│   ├── components/
│   │   └── Sidebar.js              # Navigation sidebar
│   ├── pages/
│   │   ├── FormPage.js             # Registration form + AI auto-response
│   │   ├── ChatbotPage.js          # AI chatbot with multi-turn memory
│   │   └── DashboardPage.js        # Stats dashboard + AI data summary
│   ├── utils/
│   │   ├── geminiApi.js            # Google Gemini API wrapper (with demo fallback)
│   │   └── storage.js              # localStorage persistence & stats calculator
│   ├── App.js                      # Root component with page routing
│   ├── index.js                    # React entry point
│   └── index.css                   # Full design system
├── .env                            # API key (never commit this!)
├── .env.example                    # Safe template to commit
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠 Tech Stack

| Layer    | Technology                               |
|----------|------------------------------------------|
| Frontend | React 18 (Create React App)              |
| Styling  | Pure CSS with CSS variables              |
| Icons    | Lucide React                             |
| AI / NLP | **Google Gemini API** (gemini-1.5-flash) |
| Storage  | localStorage (browser-side)              |
| Hosting  | Vercel / Netlify                         |
| Fonts    | DM Serif Display + DM Sans (Google)      |

---

## 🤖 AI Features (3 Implementations)

### 1. 🗣 AI Chatbot (`ChatbotPage.js`)
- Full conversational chatbot powered by **Gemini 1.5 Flash**
- Multi-turn memory — remembers conversation context
- Healthcare-specific system prompt covering appointments, services, emergencies, volunteering
- Quick-reply chips for common questions
- Falls back to smart demo responses if no API key is set

### 2. ✉️ AI Auto-Response (`FormPage.js`)
- After every form submission, Gemini generates a **personalised acknowledgement**
- Adapts tone based on form type (patient urgency, volunteer skills, contact subject)
- Displayed instantly on the success screen

### 3. 📊 AI Data Summary (`DashboardPage.js`)
- Sends all submission stats to Gemini with one click
- Returns a **prose operational report** for NGO staff
- Highlights urgency distribution, volunteer count, top department, and recommendations

---

## ⚙️ Setup & Installation

```bash
# 1. Unzip and enter the folder
cd healthcare-app

# 2. Install dependencies
npm install

# 3. Add your FREE Gemini API key
cp .env.example .env
# Open .env and set:
# REACT_APP_GEMINI_API_KEY=AIza...your_key_here

# 4. Run locally
npm start
# Opens at http://localhost:3000
```

---

## 🔑 Getting Your FREE Gemini API Key

**No credit card. No purchase. 100% free.**

1. Go to 👉 https://aistudio.google.com/app/apikey
2. Sign in with your **Google account**
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)
5. Paste it in your `.env` file:
   ```
   REACT_APP_GEMINI_API_KEY=AIzaSy...your_key_here
   ```
6. Restart with `npm start`

> ⚡ **No key needed to test the UI** — demo mode works automatically without any key.

---

## 🌐 Deploy to Vercel (Free)

```bash
npm i -g vercel
vercel
```

Then in Vercel Dashboard → Project → Settings → Environment Variables, add:
```
REACT_APP_GEMINI_API_KEY = AIzaSy...your_key_here
```

Redeploy and you're live!

**Netlify alternative:**
```bash
npm run build
# Drag the /build folder to netlify.com/drop
# Add env var in: Site Settings → Environment Variables
```

---

## 🏥 NGO Use Case

- **Patient intake** — digitises registration, triages urgency
- **Volunteer management** — collects skills and availability
- **24/7 AI support** — chatbot handles FAQs without staff
- **Operational reporting** — AI summaries help coordinators prioritise
- **Zero backend cost** — no database needed for small NGOs

---

## 🔒 Security Notes

- API key stored as environment variable, never in source code
- `.env` is gitignored — use `.env.example` as a template
- For production: move API calls to a serverless function to hide key from browser

---

## 📄 License

MIT — free to use and adapt for non-commercial NGO purposes.

---

*Built with ❤️ for healthcare accessibility · Powered by Google Gemini AI*
