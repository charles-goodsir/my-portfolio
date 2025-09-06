import Screenshot1 from '../../assets/Airbnb/Screenshot1.png'
import Screenshot2 from '../../assets/Airbnb/Screenshot2.png'

interface AirbnbProps {
  setActiveSection: (section: string) => void
}

function Airbnb({ setActiveSection }: AirbnbProps) {
  const images = [
    { src: Screenshot1, alt: 'Airbnb Clone - Homepage' },
    { src: Screenshot2, alt: 'Airbnb Clone - Calendar Selection' },
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
            Airbnb Clone - Homepage
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            A basic React homepage that replicates the Airbnb interface design
          </p>
          <p className="text-xl text-gray-600 mb-6">
            Built to demonstrate fundamental React and JavaScript skills,
            featuring interactive calendar selection and date picking
            functionality.
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              'React',
              'JavaScript',
              'CSS',
              'HTML',
              'Date Picker',
              'Interactive UI',
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
              href="https://github.com/charles-goodsir/airbnb-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 font-semibold"
            >
              View on GitHub
            </a>
            <a
              href="https://charles-goodsir.github.io/airbnb-clone/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
            >
              View Website
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
              This is a basic Airbnb homepage clone built with React and
              JavaScript. The project focuses on demonstrating fundamental
              frontend development skills including component structure, state
              management, and interactive user interface elements.
            </p>
            <p className="text-gray-700 mb-4">
              The main functionality includes a working calendar component that
              allows users to select dates, showcasing my ability to implement
              interactive elements and handle user input in React applications.
            </p>
            <p className="text-gray-700">
              This project serves as a foundation for understanding React
              component architecture and demonstrates practical JavaScript
              skills in a real-world application context.
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
                Interactive Calendar
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Date selection functionality</li>
                <li>• Calendar navigation</li>
                <li>• Date range picking</li>
                <li>• User-friendly interface</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                React Components
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Component-based architecture</li>
                <li>• State management</li>
                <li>• Event handling</li>
                <li>• Reusable UI elements</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                UI/UX Design
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Airbnb-inspired design</li>
                <li>• Responsive layout</li>
                <li>• Clean and modern interface</li>
                <li>• Intuitive user experience</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                JavaScript Skills
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• DOM manipulation</li>
                <li>• Event handling</li>
                <li>• Date object manipulation</li>
                <li>• Interactive functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots - Full Width Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Project Screenshots
          </h2>
        </div>
        <div className="space-y-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-gray-100 shadow-lg"
              style={{ height: '500px' }}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  height: '500px !important',
                  width: '100% !important',
                  objectFit: 'cover',
                  objectPosition: 'center !important',
                  display: 'block !important',
                  minHeight: '500px !important',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Airbnb
