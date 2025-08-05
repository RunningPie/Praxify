import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translation data
const translations = {
  en: {
    // Header
    'Home': 'Home',
    'FAQ': 'FAQ',
    'Contact Us': 'Contact Us',
    'Try Now!': 'Try Now!',
    
    // Landing page
    'Transform Your Ideas': 'Transform Your Ideas',
    'Into Clear Requirements': 'Into Clear Requirements',
    'Praxify helps non-technical users create clear, structured software requirements with AI assistance.': 'Praxify helps non-technical users create clear, structured software requirements with AI assistance.',
    'Praxify ensures your vision is clear, complete, and understood by everyone.': 'Praxify ensures your vision is clear, complete, and understood by everyone.',
    'Get Started': 'Get Started',
    'Learn More': 'Learn More',
    'Ready To Supercharge Your Ideas?': 'Ready To Supercharge Your Ideas?',
    'Try Praxify Now': 'Try Praxify Now',
    
    // Workspace
    'Create New': 'Create New',
    'Projects': 'Projects',
    'Recent Projects': 'Recent Projects',
    'Settings': 'Settings',
    
    // Chatbot
    'Type your message...': 'Type your message...',
    'Send': 'Send',
    'Quick responses': 'Quick responses',
    "Great! I'd love to help you develop this project idea. Let me ask some clarifying questions to better understand your requirements.": "Great! I'd love to help you develop this project idea. Let me ask some clarifying questions to better understand your requirements.",
    
    // Project dialog
    'Tell us about your project idea': 'Tell us about your project idea',
    'Describe your project concept, goals, or requirements...': 'Describe your project concept, goals, or requirements...',
    'Submit': 'Submit',
    'Cancel': 'Cancel',
    "What's your project idea?": "What's your project idea?",
    "Describe your project in plain language. Don't worry about technical details - our AI assistant will help you refine and structure your requirements.": "Describe your project in plain language. Don't worry about technical details - our AI assistant will help you refine and structure your requirements.",
    "500 characters": "500 characters",
    "Need inspiration? Try these examples:": "Need inspiration? Try these examples:",
    "A task management app for remote teams": "A task management app for remote teams",
    "An e-commerce website for handmade crafts": "An e-commerce website for handmade crafts",
    "A fitness tracking app with social features": "A fitness tracking app with social features",
    "A restaurant reservation system": "A restaurant reservation system",
    "Starting...": "Starting...",
    "Your project idea will be analyzed by our AI assistant to generate clarifying questions and help you create comprehensive requirements.": "Your project idea will be analyzed by our AI assistant to generate clarifying questions and help you create comprehensive requirements.",
    
    // Text editor
    'Project Title': 'Project Title',
    'Start typing here...': 'Start typing here...',
    
    // Validation
    'Quality Score': 'Quality Score',
    'Issues Found': 'Issues Found',
    'Validating...': 'Validating...',
    
    // Footer
    '© 2024 Praxify. All rights reserved.': '© 2024 Praxify. All rights reserved.',
    'Privacy Policy': 'Privacy Policy',
    'Terms of Service': 'Terms of Service'
  },
  id: {
    // Header
    'Home': 'Beranda',
    'FAQ': 'FAQ',
    'Contact Us': 'Hubungi Kami',
    'Try Now!': 'Coba Sekarang!',
    
    // Landing page
    'Transform Your Ideas': 'Ubah Ide Anda',
    'Into Clear Requirements': 'Menjadi Persyaratan yang Jelas',
    'Praxify helps non-technical users create clear, structured software requirements with AI assistance.': 'Praxify membantu pengguna non-teknis membuat persyaratan perangkat lunak yang jelas dan terstruktur dengan bantuan AI.',
    'Praxify ensures your vision is clear, complete, and understood by everyone.': 'Praxify memastikan visi Anda jelas, lengkap, dan dipahami oleh semua orang.',
    'Get Started': 'Mulai',
    'Learn More': 'Pelajari Lebih Lanjut',
    'Ready To Supercharge Your Ideas?': 'Siap Untuk Meningkatkan Ide Anda?',
    'Try Praxify Now': 'Coba Praxify Sekarang',
    
    // Workspace
    'Create New': 'Buat Baru',
    'Projects': 'Proyek',
    'Recent Projects': 'Proyek Terbaru',
    'Settings': 'Pengaturan',
    
    // Chatbot
    'Type your message...': 'Ketik pesan Anda...',
    'Send': 'Kirim',
    'Quick responses': 'Respons cepat',
    "Great! I'd love to help you develop this project idea. Let me ask some clarifying questions to better understand your requirements.": "Bagus! Saya senang membantu Anda mengembangkan ide proyek ini. Biarkan saya mengajukan beberapa pertanyaan klarifikasi untuk lebih memahami persyaratan Anda.",
    
    // Project dialog
    'Tell us about your project idea': 'Ceritakan tentang ide proyek Anda',
    'Describe your project concept, goals, or requirements...': 'Jelaskan konsep proyek, tujuan, atau persyaratan Anda...',
    'Submit': 'Kirim',
    'Cancel': 'Batal',
    "What's your project idea?": "Apa ide proyek Anda?",
    "Describe your project in plain language. Don't worry about technical details - our AI assistant will help you refine and structure your requirements.": "Jelaskan proyek Anda dalam bahasa sederhana. Jangan khawatir tentang detail teknis - asisten AI kami akan membantu Anda menyempurnakan dan menyusun persyaratan Anda.",
    "500 characters": "500 karakter",
    "Need inspiration? Try these examples:": "Butuh inspirasi? Coba contoh-contoh ini:",
    "A task management app for remote teams": "Aplikasi manajemen tugas untuk tim jarak jauh",
    "An e-commerce website for handmade crafts": "Website e-commerce untuk kerajinan tangan",
    "A fitness tracking app with social features": "Aplikasi pelacakan kebugaran dengan fitur sosial",
    "A restaurant reservation system": "Sistem reservasi restoran",
    "Starting...": "Memulai...",
    "Your project idea will be analyzed by our AI assistant to generate clarifying questions and help you create comprehensive requirements.": "Ide proyek Anda akan dianalisis oleh asisten AI kami untuk menghasilkan pertanyaan klarifikasi dan membantu Anda membuat persyaratan yang komprehensif.",
    
    // Text editor
    'Project Title': 'Judul Proyek',
    'Start typing here...': 'Mulai mengetik di sini...',
    
    // Validation
    'Quality Score': 'Skor Kualitas',
    'Issues Found': 'Masalah Ditemukan',
    'Validating...': 'Memvalidasi...',
    
    // Footer
    '© 2024 Praxify. All rights reserved.': '© 2024 Praxify. Semua hak dilindungi.',
    'Privacy Policy': 'Kebijakan Privasi',
    'Terms of Service': 'Ketentuan Layanan'
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(false)

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('praxify-language')
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('praxify-language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en')
  }

  const t = (key) => {
    return translations[language]?.[key] || key
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isLoading
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
} 