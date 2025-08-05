import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

// Utility to find ranges of a word in a node
function findWordRanges(node, word) {
  const ranges = []
  if (!node || !word) return ranges

  const text = node.textContent.toLowerCase()
  const wordLower = word.toLowerCase()
  let matchIndex = text.indexOf(wordLower)

  while (matchIndex !== -1) {
    // Ensure it's a whole word match
    const isStartBoundary = matchIndex === 0 || !/[a-z0-9]/.test(text[matchIndex - 1])
    const isEndBoundary = (matchIndex + word.length) === text.length || !/[a-z0-9]/.test(text[matchIndex + word.length])

    if (isStartBoundary && isEndBoundary) {
      const range = document.createRange()
      range.setStart(node, matchIndex)
      range.setEnd(node, matchIndex + word.length)
      ranges.push(range)
    }
    matchIndex = text.indexOf(wordLower, matchIndex + 1)
  }
  return ranges
}

function HighlightOverlay({ editorRef, issues, editorContent }) {
  const [highlights, setHighlights] = useState([])
  const [activeTooltip, setActiveTooltip] = useState(null)

  useEffect(() => {
    if (!editorRef.current || issues.length === 0) {
      setHighlights([])
      return
    }

    const editorRect = editorRef.current.getBoundingClientRect()
    const newHighlights = []

    // This function will traverse the DOM tree of the editor
    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT, null, false)
    let node
    while (node = walker.nextNode()) {
      issues.forEach(issue => {
        const phrase = issue.word_or_phrase || issue.word || issue.phrase || ''
        if (!phrase) return
        
        const ranges = findWordRanges(node, phrase)
        ranges.forEach(range => {
          const rect = range.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            newHighlights.push({
              id: `${issue.word_or_phrase || issue.word || issue.phrase}-${newHighlights.length}`,
              top: rect.top - editorRect.top,
              left: rect.left - editorRect.left,
              width: rect.width,
              height: rect.height,
              suggestion: issue.suggestion || issue.description || '',
              type: issue.type || 'Issue'
            })
          }
        })
      })
    }
    
    setHighlights(newHighlights)

  }, [issues, editorContent, editorRef]) // Recalculate when content or issues change

  const handleMouseEnter = (e, highlight) => {
    // Get the viewport-relative position of the element we're hovering over
    const highlightRect = e.target.getBoundingClientRect()

    // The desired gap between the highlight and the tooltip
    const gap = 8

    // Calculate the top position for the tooltip.
    // We add window.scrollY because getBoundingClientRect is relative to the viewport,
    // but position:absolute in the body is relative to the document.
    let top = highlightRect.top + window.scrollY - gap
    
    // Position the tooltip horizontally centered above the highlight
    let left = highlightRect.left + highlightRect.width / 2
    
    setActiveTooltip({
      text: highlight.suggestion,
      type: highlight.type,
      top,
      left,
    })
  }

  const handleMouseLeave = () => {
    setActiveTooltip(null)
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {highlights.map(h => (
        <div
          key={h.id}
          className="absolute bg-yellow-400 bg-opacity-40 rounded pointer-events-auto cursor-help transition-all duration-200 hover:bg-opacity-60"
          style={{ top: h.top, left: h.left, width: h.width, height: h.height }}
          onMouseEnter={(e) => handleMouseEnter(e, h)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      {activeTooltip && ReactDOM.createPortal(
        <div
          className="absolute z-50 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg max-w-xs"
          style={{
            // The top position now correctly includes page scroll
            top: activeTooltip.top,
            left: activeTooltip.left,
            // We use transforms to position the tooltip relative to its own size,
            // which is more robust than hardcoding dimensions.
            // This moves the tooltip up by its full height (to sit above the highlight)
            // and left by half its width (to be centered).
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-bold text-yellow-300 capitalize mb-1">{activeTooltip.type}</div>
          <div className="text-gray-200">{activeTooltip.text}</div>
          {/* Arrow pointing down */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"
          />
        </div>,
        document.body
      )}
    </div>
  )
}

export default HighlightOverlay 