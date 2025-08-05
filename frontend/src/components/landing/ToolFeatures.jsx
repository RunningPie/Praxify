import { Building2, Store } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

function ToolFeatures() {
  const { t } = useLanguage()
  const features = [
    {
      icon: <Building2 className="w-10 h-10 text-white" />,
      title: t("Government"),
      description: t("Accelerate digital transformation in public services."),
      gradient: "from-primary-600 to-primary-700"
    },
    {
      icon: <Store className="w-10 h-10 text-white" />,
      title: t("Business Owners"),
      description: t("Clarify your digital vision for developers from day one."),
      gradient: "from-secondary-600 to-secondary-700"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-800 mb-4">Tool Built For You!</h2>
        </div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div key={index} className={`card p-6 md:flex items-center gap-6 text-white bg-gradient-to-br ${feature.gradient}`}>
              <div className="shrink-0 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{t(feature.title)}</h3>
                <p className="text-white/90 text-lg">{t(feature.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ToolFeatures;
