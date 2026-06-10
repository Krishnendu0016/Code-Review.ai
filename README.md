# CodeReview.ai - AI-Powered Code Reviewer

An elegant, full-stack, and responsive web application that leverages Google's Gemini LLM to act as a **Senior Code Reviewer (7+ Years of Experience)**. Paste your code, select your programming language, and receive automated, constructive, and detailed feedback covering bugs, performance bottlenecks, security risks, scalability, and code style.

---

## 🚀 Features

- **Rich Code Editor**: Side-by-side split screen interface featuring a lightweight code editor with line numbers and real-time syntax highlighting.
- **Multilingual Support**: Supports code review for 15+ popular languages including JavaScript, TypeScript, Python, Java, C, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, SQL, and Bash.
- **Deep AI Code Reviews**: The Gemini model is configured with expert-level guidelines to detect issues, provide structured side-by-side "❌ Bad Code" vs "✅ Recommended Fix" comparisons, outline performance bottlenecks, and explain improvements.
- **Steel-Blue Dual Theme**: Gorgeous, premium-looking interface with support for both **Light Mode** and **Dark Mode**.
- **Keyboard Shortcut**: Press `Ctrl + Enter` (or `Cmd + Enter` on macOS) to instantly review your code.
- **One-Click Copy**: Convenient copy-to-clipboard buttons for both the code editor and the AI markdown feedback.
- **Robust Error Handling & Backoff**: Back-end implements automatic rate limit (HTTP 429) protection with exponential retry backoff. Front-end provides clear UI states and user-friendly error banners.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Editor Component**: `react-simple-code-editor`
- **Syntax Highlighting**: `prismjs` (editor) and `rehype-highlight` / `highlight.js` (review panel)
- **Markdown Rendering**: `react-markdown` & `marked`
- **HTTP Client**: `axios`

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **AI Integration**: Official Google Gen AI SDK (`@google/generative-ai`)
- **API Model**: `gemini-3.1-flash-lite`

---

## ⚙️ Project Structure

```text
Code-Review/
├── Backend/
│   ├── src/
│   │   ├── controllers/   # Route handler controllers (ai.controller.js)
│   │   ├── routes/        # Router configuration (ai.routes.js)
│   │   ├── services/      # AI API call and retry logic (ai.service.js)
│   │   └── app.js         # Express app configuration
│   ├── .env               # API keys (git-ignored)
│   ├── server.js          # Backend entrypoint
│   └── package.json       # Backend dependencies
├── Frontend/
│   ├── src/
│   │   ├── assets/        # Media resources
│   │   ├── App.css        # Main stylesheet
│   │   ├── App.jsx        # Main UI application shell
│   │   ├── index.css      # Core foundational CSS
│   │   └── main.jsx       # React bootstrap entrypoint
│   ├── index.html         # SPA index HTML template
│   ├── vite.config.js     # Vite compiler configuration
│   └── package.json       # Frontend dependencies
└── README.md              # Root documentation (this file)
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js** (v18.x or above recommended)
- **npm** (v9.x or above)
- **Google Gemini API Key**: Obtain a key from the [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Krishnendu0016/Code-Review.ai.git
   cd Code-Review
   ```

2. **Configure the Backend**:
   - Navigate to the `Backend` directory:
     ```bash
     cd Backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file inside the `Backend` folder:
     ```env
     GOOGLE_GEMINI_KEY=your_gemini_api_key_here
     ```

3. **Configure the Frontend**:
   - Navigate to the `Frontend` directory (from the root):
     ```bash
     cd ../Frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

---

## 🏃 Running the Application

To run the full-stack application, you will need to start both servers:

### 1. Start the Backend Server
From the `Backend/` directory:
```bash
node server.js
```
The server will start and listen on [http://localhost:3000](http://localhost:3000).

### 2. Start the Frontend Dev Server
From the `Frontend/` directory:
```bash
npm run dev
```
By default, the Vite dev server will run on [http://localhost:5173](http://localhost:5173). Open this link in your browser to interact with the application.

---

## 🤖 AI Guidelines & Prompting Customization
The reviewer behavior is driven by the system instructions located in `Backend/src/services/ai.service.js`. You can modify the system prompts or change the target model parameters directly there to suit your team's code standards or style guides.
