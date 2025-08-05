import { ArrowRight, Rocket, Palette, PenTool, Code, Star } from 'lucide-react'
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
          <div className="relative">
            <div className="relative z-10">
              {/* Rocket */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Rocket className="w-32 h-32 text-secondary-400" />
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Icons */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-4 left-8">
                  <Palette className="w-8 h-8 text-secondary-400" />
                </div>
                <div className="absolute top-16 right-12">
                  <PenTool className="w-8 h-8 text-secondary-400" />
                </div>
                <div className="absolute bottom-20 left-16">
                  <Code className="w-8 h-8 text-secondary-400" />
                </div>
                <div className="absolute bottom-8 right-8">
                  <Star className="w-8 h-8 text-secondary-400" />
                </div>
                
                {/* Swirling lines */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="text-secondary-400">
                    <path
                      d="M20,100 Q50,50 100,100 T180,100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    <path
                      d="M20,120 Q50,70 100,120 T180,120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 