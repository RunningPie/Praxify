import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-primary-800 text-white py-12">
      <div className="container mx-auto px-6 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <img src="/assets/images/white_logo.png" alt="Praxify Logo" className="w-10 h-10" />
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