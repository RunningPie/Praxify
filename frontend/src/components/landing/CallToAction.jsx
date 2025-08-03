import { Link } from 'react-router-dom'

function CallToAction() {
  return (
    <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8">
          Ready To Supercharge Your Ideas?
        </h2>
        
        <Link
          to="/workspace"
          className="btn-secondary text-lg inline-flex items-center space-x-2"
        >
          <span>Try Praxify Now</span>
        </Link>
      </div>
    </section>
  )
}

export default CallToAction 