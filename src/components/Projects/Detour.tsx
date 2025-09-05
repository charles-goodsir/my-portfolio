import IMG_5699 from '../../assets/Detour/IMG_5699.PNG'
import IMG_5700 from '../../assets/Detour/IMG_5700.PNG'
import IMG_5701 from '../../assets/Detour/IMG_5701.PNG'
import IMG_5702 from '../../assets/Detour/IMG_5702.PNG'
import IMG_5703 from '../../assets/Detour/IMG_5703.PNG'
import IMG_5704 from '../../assets/Detour/IMG_5704.PNG'

interface DetourProps {
  setActiveSection: (section: string) => void
}

function Detour({ setActiveSection }: DetourProps) {
  const images = [
    { src: IMG_5699, alt: 'Detour App Screenshot 1' },
    { src: IMG_5700, alt: 'Detour App Screenshot 2' },
    { src: IMG_5701, alt: 'Detour App Screenshot 3' },
    { src: IMG_5702, alt: 'Detour App Screenshot 4' },
    { src: IMG_5703, alt: 'Detour App Screenshot 5' },
    { src: IMG_5704, alt: 'Detour App Screenshot 6' },
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Detour</h1>
          <p className="text-xl text-gray-600 mb-6">
            A mobile app for discovering local attractions and creating custom
            routes
          </p>
          <p className="text-xl text-gray-600 mb-6">
            This project is live on the Apple Store, unfortunately the Repo is
            private due to the nature of the project.
          </p>
          <p className="text-xl text-gray-600 mb-6">
            You can click on the button below to view the project on the Apple
            Store.
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              'React Native',
              'TypeScript',
              'Firebase',
              'Google Maps API',
              'Expo',
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
              href="https://apps.apple.com/us/app/detour/id6743507600"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 font-semibold"
            >
              Detour!{' '}
            </a>
            <a
              href="#"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
            >
              Live Demo
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
              Detour is a mobile application designed to help users discover
              local attractions and create custom routes for their adventures.
              Built with React Native and TypeScript, the app provides an
              intuitive interface for exploring new places and planning
              memorable journeys.
            </p>
            <p className="text-gray-700 mb-4">
              The app integrates with Google Maps API to provide accurate
              location data and routing capabilities, while Firebase handles
              user authentication and data storage. Users can save their
              favorite locations, create custom routes, and share their
              discoveries with friends.
            </p>
            <p className="text-gray-700">
              This project showcases my skills in mobile development, API
              integration, and creating user-friendly interfaces that solve
              real-world problems.
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
                Discovery
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Browse local attractions and points of interest</li>
                <li>• Filter by category, distance, and rating</li>
                <li>• View detailed information and photos</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Route Planning
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Create custom routes with multiple stops</li>
                <li>• Optimize routes for efficiency</li>
                <li>• Save and share favorite routes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                User Experience
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Intuitive and responsive interface</li>
                <li>• Offline map support</li>
                <li>• Real-time location tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Social Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Share discoveries with friends</li>
                <li>• Rate and review locations</li>
                <li>• Follow other users' recommendations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            App Screenshots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Detour
