import { useState, useEffect, useCallback, useRef } from 'react'
import "prismjs/themes/prism.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

// Load additional Prism language grammars safely
const PRISM_LANGS = ['python', 'java', 'c', 'cpp', 'csharp', 'typescript', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'bash']
PRISM_LANGS.forEach(lang => {
  try {
    // eslint-disable-next-line no-undef
    require(`prismjs/components/prism-${lang}`)
  } catch {
    // Language not available, will fall back to plain text
  }
})

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', ext: 'JS' },
  { id: 'typescript', label: 'TypeScript', ext: 'TS' },
  { id: 'python', label: 'Python', ext: 'PY' },
  { id: 'java', label: 'Java', ext: 'JV' },
  { id: 'c', label: 'C', ext: 'C' },
  { id: 'cpp', label: 'C++', ext: 'C++' },
  { id: 'csharp', label: 'C#', ext: 'C#' },
  { id: 'go', label: 'Go', ext: 'GO' },
  { id: 'rust', label: 'Rust', ext: 'RS' },
  { id: 'php', label: 'PHP', ext: 'PHP' },
  { id: 'ruby', label: 'Ruby', ext: 'RB' },
  { id: 'swift', label: 'Swift', ext: 'SW' },
  { id: 'kotlin', label: 'Kotlin', ext: 'KT' },
  { id: 'sql', label: 'SQL', ext: 'SQL' },
  { id: 'bash', label: 'Bash', ext: 'SH' },
]

const SAMPLE_CODES = {
  javascript: `function main() {\n  console.log("Hello, World!");\n}\n\nmain();`,
  typescript: `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
  python: `def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`,
  csharp: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  rust: `fn main() {\n    println!("Hello, World!");\n}`,
  php: `<?php\necho "Hello, World!";\n?>`,
  ruby: `puts "Hello, World!"`,
  swift: `import Foundation\n\nprint("Hello, World!")`,
  kotlin: `fun main() {\n    println("Hello, World!")\n}`,
  sql: `SELECT * FROM users WHERE status = 'active';`,
  bash: `#!/bin/bash\necho "Hello, World!"\n`
}

const SUGGESTIONS = [
  '🔍 Paste a function to detect bugs',
  '⚡ Check for performance bottlenecks',
  '🔒 Scan for security vulnerabilities',
  '✨ Get refactoring suggestions',
  '📝 Review naming & documentation',
]

function App() {
  const [code, setCode] = useState(SAMPLE_CODES.javascript)
  const [review, setReview] = useState(``)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('javascript')
  const [langDropOpen, setLangDropOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedReview, setCopiedReview] = useState(false)
  const [suggIdx, setSuggIdx] = useState(0)
  const [isDark, setIsDark] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  // Rotate suggestion text
  useEffect(() => {
    const t = setInterval(() => {
      setSuggIdx(i => (i + 1) % SUGGESTIONS.length)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setLangDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const reviewCode = useCallback(async () => {
    if (!code.trim() || isLoading) return
    setIsLoading(true)
    setReview(``)
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await axios.post(`${backendUrl}/ai/get-review`, {
        code,
        language,
      })
      setReview(response.data)
    } catch (err) {
      const serverMsg = err.response?.data
      const status = err.response?.status
      if (!err.response) {
        setReview(`**Connection Error:** Could not reach the backend. Make sure the server is running.`)
      } else if (status === 429) {
        setReview(`**Rate Limited (429):** The Gemini API free-tier quota is exceeded. Please wait a minute and try again.`)
      } else if (serverMsg && typeof serverMsg === 'string' && serverMsg.length < 400) {
        setReview(`**AI Error:** ${serverMsg}`)
      } else {
        setReview(`**Error ${status}:** Something went wrong. Please try again.`)
      }
    } finally {
      setIsLoading(false)
    }
  }, [code, language, isLoading])


  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        reviewCode()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [reviewCode])

  const lineCount = code.split('\n').length

  const selectLanguage = (lang) => {
    setLanguage(lang.id)
    setLangDropOpen(false)
    setCode(SAMPLE_CODES[lang.id] || `// write your ${lang.label} code here\n`)
    setReview('')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyReview = () => {
    navigator.clipboard.writeText(review)
    setCopiedReview(true)
    setTimeout(() => setCopiedReview(false), 2000)
  }

  const clearCode = () => {
    setCode('')
    setReview('')
  }

  const currentLang = LANGUAGES.find(l => l.id === language) || LANGUAGES[0]

  const highlightCode = (codeStr) => {
    const grammar = prism.languages[language]
    if (grammar) {
      return prism.highlight(codeStr, grammar, language)
    }
    return prism.highlight(codeStr, prism.languages.javascript, 'javascript')
  }

  return (
    <div className="app-shell" data-theme={isDark ? 'dark' : 'light'}>

      {/* ── Header ── */}
      <header className="header">
        <div className="header-brand">
          <h1 className="header-title">
            Code<span>Review.ai</span>
          </h1>
        </div>

        <div className="header-center">
          <span className="shortcut-hint">
            <kbd>Ctrl</kbd><kbd>↵</kbd> to review
          </span>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setIsDark(d => !d)}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* ── Main Split Layout ── */}
      <main className="main-content">

        {/* ── Left Panel: Code Editor ── */}
        <div className="panel editor-panel">
          <div className="panel-header">
            <div className="panel-header-left">
              <div className="panel-icon">✏️</div>
              <span className="panel-label">Code Editor</span>
            </div>
            <div className="panel-header-actions">
              {/* Language Selector */}
              <div className="lang-selector" ref={dropRef}>
                <button
                  className="lang-btn"
                  onClick={() => setLangDropOpen(o => !o)}
                  title="Select language"
                >
                  <span className="lang-ext">{currentLang.ext}</span>
                  <span className="lang-name">{currentLang.label}</span>
                  <span className="lang-chevron">{langDropOpen ? '▲' : '▼'}</span>
                </button>
                {langDropOpen && (
                  <div className="lang-dropdown">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.id}
                        className={`lang-option ${lang.id === language ? 'active' : ''}`}
                        onClick={() => selectLanguage(lang)}
                      >
                        <span className="lang-option-ext">{lang.ext}</span>
                        <span>{lang.label}</span>
                        {lang.id === language && <span className="lang-check">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="icon-btn" onClick={copyCode} title="Copy code">
                {copied ? '✓' : '⎘'}
              </button>
              <button className="icon-btn danger" onClick={clearCode} title="Clear editor" disabled={!code}>
                ✕
              </button>
            </div>
          </div>

          <div className="editor-wrapper">
            <div className="line-numbers" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="line-number">{i + 1}</div>
              ))}
            </div>
            <div className="editor-body">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlightCode}
                padding={20}
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  minHeight: '100%',
                  background: 'transparent',
                  color: isDark ? '#e2e8f0' : '#2c3e47',
                }}
              />
            </div>
          </div>

          <div className="editor-footer">
            <span className="char-count">
              Ln {lineCount} · {code.length} chars
            </span>
            <button
              id="review-btn"
              className="review-btn"
              onClick={reviewCode}
              disabled={isLoading || !code.trim()}
              title="Analyze code with AI (Ctrl+Enter)"
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner" />
                  Analyzing…
                </>
              ) : (
                <>
                  <span className="review-btn-icon">✦</span>
                  Review Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Right Panel: AI Review ── */}
        <div className="panel review-panel">
          <div className="panel-header">
            <div className="panel-header-left">
              <div className="panel-icon">🤖</div>
              <span className="panel-label">AI Review</span>
            </div>
            {review && !isLoading && (
              <div className="panel-header-actions">
                <span className="panel-complete-badge">Complete</span>
                <button className="icon-btn" onClick={copyReview} title="Copy review">
                  {copiedReview ? '✓' : '⎘'}
                </button>
              </div>
            )}
          </div>

          <div className="review-body">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-orb" />
                <div className="loading-text">
                  Analyzing your code
                  <span className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                </div>
                <p className="loading-sub">Senior AI engineer is reviewing your {currentLang.label} code</p>
              </div>
            ) : review ? (
              <div className="review-content">
                <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-glow-ring">
                  <div className="empty-state-icon">🔍</div>
                </div>
                <p className="empty-state-title">Awaiting your code</p>
                <p className="empty-state-suggestion" key={suggIdx}>
                  {SUGGESTIONS[suggIdx]}
                </p>
                <div className="empty-state-steps">
                  <div className="step">
                    <span className="step-num">1</span>
                    <span>Write or paste code in the editor</span>
                  </div>
                  <div className="step">
                    <span className="step-num">2</span>
                    <span>Select the programming language</span>
                  </div>
                  <div className="step">
                    <span className="step-num">3</span>
                    <span>Click <strong>Review Code</strong> or press <kbd>Ctrl+↵</kbd></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

export default App
