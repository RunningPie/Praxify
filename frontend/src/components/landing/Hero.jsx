import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Hero() {
  const { t } = useTranslation()
  return (
    <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {t('landing.title')}
              <br />
              {t('landing.subtitle')}
            </h1>
            
            <p className="text-xl text-primary-100 max-w-2xl">
              {t('landing.description')}
            </p>
            
            <p className="text-lg text-primary-200 max-w-2xl">
              {t('landing.vision')}
            </p>
            
            <Link
              to="/workspace"
              className="btn-secondary inline-flex items-center space-x-2 text-lg"
            >
              <span>{t('landing.getStarted')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative flex justify-center items-center">
            <img 
              src="/assets/images/landing_rocket.webp" 
              alt="AI-powered rocket transforming ideas into clear requirements" 
              className="w-full max-w-md lg:max-w-lg xl:max-w-xl object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 