import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import PraxifyFlow from '../components/landing/PraxifyFlow'
import ToolFeatures from '../components/landing/ToolFeatures'
import CallToAction from '../components/landing/CallToAction'
import Footer from '../components/landing/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <PraxifyFlow />
      <ToolFeatures />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default LandingPage 