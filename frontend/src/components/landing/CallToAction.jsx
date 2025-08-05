import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function CallToAction() {
  const { t } = useTranslation()
  return (
    <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8">
          {t('landing.readyToSupercharge')}
        </h2>
        
        <Link
          to="/workspace"
          className="btn-secondary text-lg inline-flex items-center space-x-2"
        >
          <span>{t('landing.getStarted')}</span>
        </Link>
      </div>
    </section>
  )
}

export default CallToAction 