import { Link } from 'react-router-dom'

function WorkspacePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Workspace Coming Soon
        </h1>
        <p className="text-gray-600 mb-8">
          The interactive editor and AI assistant panel will be implemented here.
        </p>
        <Link
          to="/"
          className="btn-primary"
        >
          Back to Landing Page
        </Link>
      </div>
    </div>
  )
}

export default WorkspacePage 