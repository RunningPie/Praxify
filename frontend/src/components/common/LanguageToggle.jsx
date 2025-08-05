import { useTranslation } from 'react-i18next'

function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors ${className}`}
      title={i18n.language === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
    >
      <span className="text-sm font-medium">
        {i18n.language === 'en' ? 'EN' : 'ID'}
      </span>
      <svg 
        className="w-4 h-4 text-gray-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
        />
      </svg>
    </button>
  )
}

export default LanguageToggle 