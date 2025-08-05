import { useState } from 'react'
import { X, Rocket, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function ProjectIdeaDialog({ isOpen, onClose, onSubmit }) {
  const { t } = useTranslation()
  const [projectIdea, setProjectIdea] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!projectIdea.trim()) return

    setIsSubmitting(true)
    await onSubmit(projectIdea.trim())
    // setIsSubmitting(false)
    // onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{t('projectDialog.title')}</h2>
                <p className="text-gray-600">{t('projectDialog.tellUsAbout')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-8 py-6">
          <div className="mb-6">
            <label htmlFor="projectIdea" className="block text-lg font-semibold text-gray-800 mb-3">
              {t('projectDialog.whatsYourIdea')}
            </label>
            <p className="text-gray-600 mb-4">
              {t('projectDialog.description')}
            </p>
            <textarea
              id="projectIdea"
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              placeholder={t('projectDialog.placeholder')}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              {projectIdea.length}/{t('projectDialog.characters')}
            </div>
          </div>

          {/* Examples */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('projectDialog.needInspiration')}</h3>
            <div className="space-y-2">
              {[
                t('projectDialog.examples.taskManagement'),
                t('projectDialog.examples.ecommerce'),
                t('projectDialog.examples.fitness'),
                t('projectDialog.examples.restaurant')
              ].map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setProjectIdea(example)}
                  className="block w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('projectDialog.cancel')}
            </button>
            <button
              type="submit"
              disabled={!projectIdea.trim() || isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('projectDialog.starting')}</span>
                </>
              ) : (
                <>
                  <span>{t('projectDialog.submit')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            {t('projectDialog.footer')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProjectIdeaDialog