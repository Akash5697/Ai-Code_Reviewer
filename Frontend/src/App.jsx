import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(` function sum() {
   return 1 + 1
 }`)
  const [review, setReview] = useState(``)
  const [isReviewing, setIsReviewing] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      setIsReviewing(true)
      const response = await axios.post('https://ai-code-reviewer-rm0s.onrender.com/ai/get-review', { code })
      setReview(response.data)
    } catch (error) {
      console.error('Review failed:', error)
      setReview('```\nError: Failed to get code review. Please try again.\n```')
    } finally {
      setIsReviewing(false)
    }
  }

  return (
    <>
      <header className="app-header">
        <h1>AI Code Reviewer</h1>
        <p>Get instant feedback on your code</p>
      </header>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={isReviewing ? undefined : reviewCode}
            className={`review ${isReviewing ? 'reviewing' : ''}`}
          >
            {isReviewing ? 'Reviewing...' : 'Review'}
          </div>
        </div>
        <div className="right">
          <Markdown
            rehypePlugins={[rehypeHighlight]}
          >{review}</Markdown>
        </div>
      </main>
    </>
  )
}

export default App