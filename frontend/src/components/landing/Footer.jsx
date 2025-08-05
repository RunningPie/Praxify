import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-primary-800 text-white py-12">
      <div className="container mx-auto px-6 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary-800 font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold">Praxify</span>
        </div>

        {/* Tagline */}
        <p className="text-lg text-primary-200 mb-4">
          "Accelerating Developments From Day One"
        </p>

        {/* Copyright */}
        <p className="text-sm text-primary-300">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}

export default Footer 