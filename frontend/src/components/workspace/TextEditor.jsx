import { useState, useRef, useEffect, useCallback, forwardRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import UnderlineExtension from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
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
  AlertCircle,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './TextEditor.css'

// Toolbar component
const Toolbar = ({ editor, isValidating, validationScore }) => {
  const { t } = useTranslation()
  
  const toolbarButtons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), title: 'Bold', active: editor?.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), title: 'Italic', active: editor?.isActive('italic') },
    { icon: Underline, action: () => editor.chain().focus().toggleUnderline().run(), title: 'Underline', active: editor?.isActive('underline') },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), title: 'Heading 1', active: editor?.isActive('heading', { level: 1 }) },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), title: 'Heading 2', active: editor?.isActive('heading', { level: 2 }) },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), title: 'Heading 3', active: editor?.isActive('heading', { level: 3 }) },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), title: 'Bullet List', active: editor?.isActive('bulletList') },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), title: 'Numbered List', active: editor?.isActive('orderedList') },
         { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign('left').run(), title: 'Align Left', active: editor?.isActive('textAlign', { align: 'left' }) },
     { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign('center').run(), title: 'Align Center', active: editor?.isActive('textAlign', { align: 'center' }) },
     { icon: AlignRight, action: () => editor.chain().focus().setTextAlign('right').run(), title: 'Align Right', active: editor?.isActive('textAlign', { align: 'right' }) },
    { icon: Link, action: () => {
      const url = prompt('Enter URL:')
      if (url) {
        editor.chain().focus().setLink({ href: url }).run()
      }
    }, title: 'Insert Link', active: editor?.isActive('link') },
    { icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), title: 'Code Block', active: editor?.isActive('codeBlock') }
  ]

  if (!editor) {
    return null
  }

  return (
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
           onClick={button.action}
           className={`p-2 hover:bg-gray-200 rounded transition-colors ${
             button.active ? 'bg-gray-300' : ''
           }`}
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
            <span className="text-xs">{t('textEditor.validating')}</span>
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
  )
}

const TextEditor = forwardRef(({ content, onChange, placeholder, onValidationIssues }, ref) => {
  const { t } = useTranslation()
  const [validationIssues, setValidationIssues] = useState([])
  const [isValidating, setIsValidating] = useState(false)
  const [validationScore, setValidationScore] = useState(null)

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
             UnderlineExtension,
       LinkExtension.configure({
         openOnClick: false,
         HTMLAttributes: {
           class: 'text-blue-600 underline',
         },
       }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      // Trigger debounced validation
      debouncedValidation(editor.getText())
    },
    editorProps: {
      attributes: {
        class: 'min-h-full outline-none text-gray-800 leading-relaxed prose prose-sm max-w-none',
        'data-placeholder': placeholder || t('textEditor.startTyping'),
      },
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  return (
    <div className="flex flex-col h-full bg-white" ref={ref}>
      {/* Title */}
      <div className="px-6 py-4 border-b border-gray-200">
        <input
          type="text"
          placeholder={t('textEditor.projectTitle')}
          className="w-full text-2xl font-bold text-gray-800 placeholder-gray-400 border-none outline-none"
        />
      </div>

      {/* Toolbar */}
      <Toolbar 
        editor={editor} 
        isValidating={isValidating}
        validationScore={validationScore}
      />

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
})

export default TextEditor