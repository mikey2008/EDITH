import { useState, useRef } from 'react'
import { isValidTopic, sanitizeInput } from './utils/security'
import { logger } from './utils/logger'

function App() {
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  
  // Rate limiting / Abuse Protection
  const lastRequestRef = useRef(0)
  const RATE_LIMIT_MS = 4000;

  const performResearch = async (searchTopic) => {
    try {
      // Step 1: Search Wikipedia for the closest matching pages
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTopic)}&utf8=&format=json&origin=*`
      const searchRes = await fetch(searchUrl)
      const searchData = await searchRes.json()
      
      if (!searchData.query.search || searchData.query.search.length === 0) {
        return `No internet data found for "${searchTopic}". Try a different topic.`
      }
      
      // Get top 3 titles to make sure we don't accidentally pick a "disambiguation" page
      const top3Titles = searchData.query.search.slice(0, 3).map(r => r.title).join('|')
      
      // Step 2: Fetch the detailed text of those pages
      const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(top3Titles)}&origin=*`
      const extractRes = await fetch(extractUrl)
      const extractData = await extractRes.json()
      
      const pages = Object.values(extractData.query.pages)
      // Avoid disambiguation pages which usually say "may refer to..."
      let validPages = pages.filter(p => p.extract && !p.extract.toLowerCase().includes("may refer to:"))
      
      // If all are filtered out, just fall back
      if (validPages.length === 0) validPages = pages.filter(p => p.extract)
      if (validPages.length === 0) return `Could not retrieve detailed data for "${searchTopic}".`
      
      // Pick the page with the longest extract to ensure deep data
      validPages.sort((a, b) => b.extract.length - a.extract.length)
      const bestPage = validPages[0]
      const bestMatchTitle = bestPage.title
      const extract = bestPage.extract
      
      // Step 3: Process text into Overview, Important Dates, and a Fact
      const sentences = extract.match(/[^.!?]+[.!?]+/g) || [extract]
      
      const overview = sentences.slice(0, 2).join(' ').trim()
      
      // Find sentences with 4 digit years
      const dateSentences = sentences.filter(s => /\b[12][0-9]{3}\b/.test(s) && !overview.includes(s))
      const importantDatesList = dateSentences.slice(0, 3).map(s => s.trim())
      
      const remainingSentences = sentences.filter(s => !overview.includes(s) && !importantDatesList.some(d => d.includes(s)))
      const fact = remainingSentences.length > 0 
        ? remainingSentences[Math.floor(Math.random() * remainingSentences.length)].trim() 
        : "No further facts available from the primary summary."
      
      return {
        title: bestMatchTitle.toUpperCase(),
        overview: overview,
        dates: importantDatesList,
        fact: fact
      }
    } catch (e) {
      logger.logApiError('wikipedia/search', e.message)
      return `Error conducting research: ${e.message}`
    }
  }

  const handleGenerate = async (e) => {
    if (e) e.preventDefault() // For form submissions

    if (!topic.trim()) return

    const now = Date.now();
    if (now - lastRequestRef.current < RATE_LIMIT_MS) {
      const waitTime = Math.ceil((RATE_LIMIT_MS - (now - lastRequestRef.current)) / 1000);
      logger.logSuspiciousActivity('UI rate limit triggered - fast clicking detected', { topic });
      setResult(`Security Timeout - Potential spam detected. Please wait ${waitTime} seconds before querying Wikipedia again.`);
      return;
    }

    if (!isValidTopic(topic)) {
      setResult("Security Alert - Invalid input. Topics must be 2-100 characters and contain only letters, numbers, spaces, and basic punctuation (- _ ' .).")
      return;
    }

    lastRequestRef.current = Date.now();

    setIsLoading(true)
    setResult(null)

    const cleanTopic = sanitizeInput(topic)
    const researchData = await performResearch(cleanTopic)
    
    setIsLoading(false)
    setResult(researchData)
  }

  return (
    <div className="dialog-container">
      <h1 className="title">EDITH</h1>

      <form onSubmit={handleGenerate} style={{ display: 'contents' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Enter your topic..." 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button 
          type="submit"
          className="action-btn" 
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? 'Researching internet...' : 'Generate'}
        </button>
      </form>

      {(isLoading || result) && (
        <div className="output-area">
          {isLoading ? (
            <div className="spinner"></div>
          ) : typeof result === 'string' ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{result}</div>
          ) : (
            <div style={{ textAlign: 'left', width: '100%' }}>
              <div style={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                RESEARCH REPORT: {result.title}
              </div>
              
              <div style={{ marginBottom: '0.25rem' }}><strong>Overview:</strong></div>
              <div style={{ marginBottom: '1rem', lineHeight: '1.4' }}>{result.overview}</div>
              
              <div style={{ marginBottom: '0.25rem' }}><strong>Important Dates & Things:</strong></div>
              {result.dates.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                  {result.dates.map((date, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>{date}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ marginBottom: '1rem' }}>No specific dates highlighted in the database summary.</div>
              )}
              
              <div style={{ marginBottom: '0.25rem' }}><strong>Fact:</strong></div>
              <div style={{ lineHeight: '1.4' }}>Did you know? {result.fact}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
