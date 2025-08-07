import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from '../common/LanguageToggle'

function Header() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Clickable */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src="/assets/images/blue_logo.png" alt="Praxify Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-800">Praxify</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              {t('header.home')}
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              {t('header.faq')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              {t('header.contact')}
            </Link>
          </nav>

          {/* Language Toggle and CTA Button */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Link
              to="/workspace"
              className="btn-primary text-sm px-4 py-2"
            >
              {t('header.tryNow')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 