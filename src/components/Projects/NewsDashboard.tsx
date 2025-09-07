import Screenshot1 from '../../assets/NewsDashboard/Screenshot1.png'
import Screenshot2 from '../../assets/NewsDashboard/Screenshot2.png'
import Screenshot3 from '../../assets/NewsDashboard/Screenshot3.png'

interface NewsDashboardProps {
  setActiveSection: (section: string) => void
}

function NewsDashboard({ setActiveSection }: NewsDashboardProps) {
  const images = [
    { src: Screenshot1, alt: 'News Dashboard - Main View' },
    { src: Screenshot2, alt: 'News Dashboard - Category Filter' },
    { src: Screenshot3, alt: 'News Dashboard - Article Details' },
  ]

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setActiveSection('projects')}
          className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            News Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            A full-stack news aggregation dashboard with Python web scraping,
            database population, and React frontend.
          </p>
          <p className="text-xl text-gray-600 mb-6">
            Features custom Python scripts for scraping news sites, crypto data,
            and weather APIs, with automated database population and a modern
            React interface.
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              'React',
              'TypeScript',
              'Python',
              'Web Scraping',
              'Database',
              'Crypto API',
              'Weather API',
              'Tailwind CSS',
              'Vite',
            ].map((tech) => (
              <span
                key={tech}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Project Links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/charles-goodsir/news-script"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 font-semibold"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              The News Dashboard is a full-stack application that combines
              Python backend scripting with a modern React frontend. The project
              features custom Python scripts that scrape news websites, fetch
              cryptocurrency data, and integrate weather APIs to populate a
              comprehensive database.
            </p>
            <p className="text-gray-700 mb-4">
              The backend includes automated data collection scripts for news
              aggregation, crypto market data, and weather information. The
              React frontend provides a clean, organized interface for viewing
              this data with real-time updates, category filtering, and
              responsive design across all devices.
            </p>
            <p className="text-gray-700">
              This project demonstrates full-stack development skills, including
              Python web scraping, database management, API integration, and
              modern React development with TypeScript.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Python Web Scraping
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Automated news site scraping</li>
                <li>• Crypto market data collection</li>
                <li>• Weather API integration</li>
                <li>• Scheduled data updates</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Database Management
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Automated database population</li>
                <li>• Data cleaning and validation</li>
                <li>• Efficient data storage</li>
                <li>• Data integrity maintenance</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                React Frontend
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Real-time data visualization</li>
                <li>• Category filtering and search</li>
                <li>• Responsive design</li>
                <li>• Interactive user interface</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Full-Stack Integration
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Python backend automation</li>
                <li>• API data processing</li>
                <li>• Frontend-backend communication</li>
                <li>• End-to-end data pipeline</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Screenshots - Full Width Section */}
        <div className="">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Project Screenshots
            </h2>
          </div>
          <div className="space-y-8">
            {images.map((image, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="border border-gray-300 rounded-lg shadow-lg"
                  style={{
                    maxHeight: '600px',
                    maxWidth: '90%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsDashboard
