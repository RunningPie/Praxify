import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function ChatbotPanel({ initialMessage, onApiCall }) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          id: 1,
          type: 'user',
          content: initialMessage,
          timestamp: new Date()
        },
                 {
           id: 2,
           type: 'bot',
           content: t('chatbot.welcomeMessage'),
           timestamp: new Date()
         }
      ])
      
      // Automatically trigger initial elicitation
      handleElicitRequirements(initialMessage)
    }
  }, [initialMessage])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleElicitRequirements = async (projectIdea) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/elicit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: projectIdea })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      // Add AI response with questions
      const botMessage = {
        id: Date.now(),
        type: 'bot',
        content: formatElicitationResponse(data),
        timestamp: new Date(),
        data: data
      }
      
      setMessages(prev => [...prev, botMessage])
      onApiCall?.(data)
    } catch (error) {
      console.error('Error calling elicit API:', error)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: t('chatbot.errorMessage'),
        timestamp: new Date()
      }])
    }
    setIsLoading(false)
  }

  const formatElicitationResponse = (data) => {
    let response = ""
    
    if (data.summary) {
      response += t("**Project Analysis:**\n") + data.summary + t("\n\n")
    }
    
    if (data.questions && data.questions.length > 0) {
      response += t("**I have some questions to help clarify your requirements:**\n\n")
      data.questions.forEach((question, index) => {
        response += `${index + 1}. ${question}\n`
      })
      response += "\n"
    }
    
    if (data.personas && data.personas.length > 0) {
      response += t("**Potential Users:**\n")
      data.personas.forEach((persona, index) => {
        response += `• ${persona}\n`
      })
      response += "\n"
    }
    
    if (data.next_steps && data.next_steps.length > 0) {
      response += t("**Suggested Next Steps:**\n")
      data.next_steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`
      })
    }
    
    return response || t("I've analyzed your project idea. Please feel free to ask me any questions or provide more details!")
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response for now - in the future, this could call a chat endpoint
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: t('chatbot.processingMessage'),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageContent = (content) => {
    // Simple markdown-style formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Praxee Bot</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Chat</span>
            </div>
          </div>
        </div>
      </div>

             {/* Messages - Scrollable Section */}
       <div className="flex-1 overflow-y-auto">
         <div className="p-4 space-y-4">
           {messages.map((message) => (
             <div
               key={message.id}
               className={`flex space-x-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               {message.type === 'bot' && (
                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                   <Bot className="w-4 h-4 text-white" />
                 </div>
               )}
               <div
                 className={`max-w-sm px-4 py-2 rounded-lg text-sm ${
                   message.type === 'user'
                     ? 'bg-purple-500 text-white'
                     : 'bg-gray-100 text-gray-800'
                 }`}
               >
                 <div 
                   className="whitespace-pre-line"
                   dangerouslySetInnerHTML={{ 
                     __html: formatMessageContent(message.content) 
                   }}
                 />
               </div>
               {message.type === 'user' && (
                 <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                   <User className="w-4 h-4 text-white" />
                 </div>
               )}
             </div>
           ))}
           
           {isLoading && (
             <div className="flex space-x-3 justify-start">
               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                 <Bot className="w-4 h-4 text-white" />
               </div>
               <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                 <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
               </div>
             </div>
           )}
           
           <div ref={messagesEndRef} />
         </div>
       </div>

      {/* Chat Suggestions */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">{t('chatbot.quickResponses')}:</div>
        <div className="flex flex-wrap gap-1">
          <button className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors">
            How quick do you want the response be?
          </button>
          <button className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full hover:bg-purple-200 transition-colors">
            Do you think 20ms is fast enough for this app?
          </button>
        </div>
      </div>

             {/* Input */}
       <div className="p-4 border-t border-gray-200">
         <div className="flex space-x-2">
           <input
             type="text"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onKeyPress={handleKeyPress}
             placeholder={t('chatbot.typeMessage')}
             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
           />
           <button
             onClick={handleSendMessage}
             disabled={!inputValue.trim() || isLoading}
             className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             <Send className="w-4 h-4" />
           </button>
         </div>
       </div>
    </div>
  )
}

export default ChatbotPanel