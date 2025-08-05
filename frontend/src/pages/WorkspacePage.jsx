import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/workspace/Sidebar'
import TextEditor from '../components/workspace/TextEditor'
import ChatbotPanel from '../components/workspace/ChatbotPanel'
import ProjectIdeaDialog from '../components/workspace/ProjectIdeaDialog'
import HighlightOverlay from '../components/workspace/HighlightOverlay'

function WorkspacePage() {
  const [showProjectDialog, setShowProjectDialog] = useState(true)
  const [projectIdea, setProjectIdea] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [validationIssues, setValidationIssues] = useState([])
  const editorRef = useRef(null)
  const navigate = useNavigate()

  const handleProjectSubmit = async (idea) => {
    setProjectIdea(idea)
    setShowProjectDialog(false)
  }

  // Extract project name from the idea (first few words)
  const getProjectName = (idea) => {
    if (!idea) return "Project 1"
    const words = idea.split(' ').slice(0, 3).join(' ')
    return words.length > 20 ? words.substring(0, 20) + '...' : words
  }

  const handleCloseDialog = () => {
    setShowProjectDialog(false)
    // If user closes without submitting, redirect back to landing page
    if (!projectIdea) {
      navigate('/')
    }
  }

  const handleApiResponse = (data) => {
    // Handle API responses from the chatbot (for future use)
    console.log('API Response:', data)
  }

  const handleValidationIssues = (issues) => {
    setValidationIssues(issues)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar currentProjectName={getProjectName(projectIdea)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Text Editor */}
        <div className="flex-1 relative">
          <TextEditor 
            ref={editorRef}
            content={editorContent}
            onChange={setEditorContent}
            onValidationIssues={handleValidationIssues}
            placeholder="Start writing your requirements here. The AI assistant will help you refine and structure them."
          />
          {/* Validation Highlights Overlay */}
          <HighlightOverlay
            editorRef={editorRef}
            issues={validationIssues}
            editorContent={editorContent}
          />
        </div>
        
        {/* Chatbot Panel */}
        <ChatbotPanel 
          initialMessage={projectIdea}
          onApiCall={handleApiResponse}
        />
      </div>

      {/* Project Idea Dialog */}
      <ProjectIdeaDialog
        isOpen={showProjectDialog}
        onClose={handleCloseDialog}
        onSubmit={handleProjectSubmit}
      />
    </div>
  )
}

export default WorkspacePage 