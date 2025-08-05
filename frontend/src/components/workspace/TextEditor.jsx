import { useState, useRef, useEffect, useCallback, forwardRef } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Link,
  Code,
  AlertCircle
} from 'lucide-react'

const TextEditor = forwardRef(({ content, onChange, placeholder, onValidationIssues }, ref) => {
  // Use a ref to hold a reference to the editable div
  const editorRef = useRef(null)
  const [validationIssues, setValidationIssues] = useState([])
  const [isValidating, setIsValidating] = useState(false)
  const [validationScore, setValidationScore] = useState(null)

  const toolbarButtons = [
    { icon: Bold, action: 'bold', title: 'Bold' },
    { icon: Italic, action: 'italic', title: 'Italic' },
    { icon: Underline, action: 'underline', title: 'Underline' },
    { icon: List, action: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, action: 'insertOrderedList', title: 'Numbered List' },
    { icon: AlignLeft, action: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, action: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, action: 'justifyRight', title: 'Align Right' },
    { icon: Link, action: 'createLink', title: 'Insert Link' },
    { icon: Code, action: 'formatBlock', title: 'Code Block', value: 'PRE' }
  ]

  // This effect syncs the editor's content with the `content` prop.
  // It runs only when the `content` prop changes from the parent.
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  // Store validation issues for highlighting
  const [highlightedIssues, setHighlightedIssues] = useState([])

  // Update highlighted issues when validation issues change
  useEffect(() => {
    setHighlightedIssues(validationIssues)
  }, [validationIssues])

  // Simple validation display without interfering with editing

  const handleToolbarClick = (action, value = null) => {
    // For 'formatBlock', the third argument is a tag name like 'PRE' or 'H1'
    const commandValue = action === 'formatBlock' ? value : null;
    if (action === 'createLink') {
      const url = prompt('Enter URL:')
      if (url) {
        document.execCommand(action, false, url)
      }
    } else {
      document.execCommand(action, false, commandValue);
    }
    // Refocus the editor after click
    editorRef.current.focus();
  }

  // Debounced validation function
  const debouncedValidation = useCallback(
    debounce(async (text) => {
      if (!text || text.length < 10) {
        setValidationIssues([])
        setValidationScore(null)
        return
      }

      setIsValidating(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            document: text,
            focus_areas: ['ambiguity', 'completeness']
          })
        })

        if (!response.ok) {
          throw new Error('Validation request failed')
        }

        const data = await response.json()
        const issues = data.issues || []
        setValidationIssues(issues)
        setValidationScore(data.score || null)
        
        // Pass validation issues to parent component
        if (onValidationIssues) {
          onValidationIssues(issues)
        }
      } catch (error) {
        console.error('Validation error:', error)
        setValidationIssues([])
        setValidationScore(null)
        
        // Clear validation issues in parent component
        if (onValidationIssues) {
          onValidationIssues([])
        }
      } finally {
        setIsValidating(false)
      }
    }, 1000), // 1 second debounce
    []
  )

  // Debounce utility function
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const handleInput = (e) => {
    const text = e.target.innerHTML
    // Inform the parent component about the change
    onChange(text)
    // Trigger debounced validation
    debouncedValidation(text)
  }

  return (
    <div className="flex flex-col h-full bg-white" ref={ref}>
      {/* Title */}
      <div className="px-6 py-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Project Title"
          className="w-full text-2xl font-bold text-gray-800 placeholder-gray-400 border-none outline-none"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-1 px-6 py-3 border-b border-gray-200 bg-gray-50">
        <select className="px-3 py-1 border border-gray-300 rounded text-sm">
          <option>14</option>
          <option>16</option>
          <option>18</option>
          <option>20</option>
          <option>24</option>
        </select>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            // Use a mousedown event to prevent the editor from losing focus
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent blur
              handleToolbarClick(button.action, button.value);
            }}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={button.title}
          >
            <button.icon className="w-4 h-4 text-gray-600" />
          </button>
        ))}

        {/* Validation Status */}
        <div className="ml-auto flex items-center space-x-2">
          {isValidating && (
            <div className="flex items-center space-x-1 text-blue-600">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Validating...</span>
            </div>
          )}
          {validationScore !== null && (
            <div className={`flex items-center space-x-1 text-xs ${
              validationScore >= 80 ? 'text-green-600' : 
              validationScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              <AlertCircle className="w-3 h-3" />
              <span>Score: {validationScore}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          // Use the CSS placeholder from Step 1
          data-placeholder={placeholder || "Start typing here..."}
          className="min-h-full outline-none text-gray-800 leading-relaxed"
          style={{ fontSize: '16px', lineHeight: '1.6' }}
          // We no longer render content directly, so this is not needed
          // suppressContentEditableWarning={true}
          // The useEffect handles setting the initial content
        />
      </div>
    </div>
  )
})

export default TextEditor