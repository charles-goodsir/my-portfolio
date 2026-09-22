import { Link } from 'react-router'
import ScreenshotFigure from '../ui/ScreenshotFigure'
import img1 from '../../assets/Detour/detour-1.webp'
import img2 from '../../assets/Detour/detour-2.webp'
import img3 from '../../assets/Detour/detour-3.webp'
import img4 from '../../assets/Detour/detour-4.webp'
import img5 from '../../assets/Detour/detour-5.webp'
import img6 from '../../assets/Detour/detour-6.webp'

function Detour() {
  const images = [
    { src: img1, alt: 'Detour App Screenshot 1' },
    { src: img2, alt: 'Detour App Screenshot 2' },
    { src: img3, alt: 'Detour App Screenshot 3' },
    { src: img4, alt: 'Detour App Screenshot 4' },
    { src: img5, alt: 'Detour App Screenshot 5' },
    { src: img6, alt: 'Detour App Screenshot 6' },
  ]

  return (
    <section className="bg-page py-16 px-4">
      <div className="max-w-[45rem] mx-auto">
        {/* Back Button */}
        <Link
          to="/projects"
          className="mb-8 flex items-center text-primary hover:underline underline-offset-2 transition-colors duration-300"
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
        </Link>

        {/* Project Header */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-ink">Detour</h1>
            <span className="inline-block bg-success/10 text-success px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              Complete
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            A mobile app for discovering local attractions and creating custom
            routes
          </p>
          <p className="text-xl text-ink-muted mb-6">
            This project is live on the Apple Store, unfortunately the Repo is
            private due to the nature of the project.
          </p>
          <p className="text-xl text-ink-muted mb-6">
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
                className="border border-line bg-sunken text-ink-muted px-3 py-1.5 rounded-md font-mono text-xs"
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
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              Detour!{' '}
            </a>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              Detour is a React Native app for discovering places nearby and
              building a route between them, live on the App Store. I
              designed, built, and shipped it independently, including the
              App Store submission.
            </p>
            <p className="text-ink-muted">
              Google Maps API handles search, location, and routing; Firebase
              handles auth and stores each user's saved places and routes. The
              repo is private, so the App Store listing and this page are what's
              public.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Discovery
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Browse local attractions and points of interest</li>
                <li>• Filter by category, distance, and rating</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Route Planning
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Create custom routes with multiple stops</li>
                <li>• Save and share favorite routes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                User Experience
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Offline map support</li>
                <li>• Real-time location tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Social Features
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Share discoveries with friends</li>
                <li>• Rate and review locations</li>
                <li>• Follow other users' recommendations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            App Screenshots
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <ScreenshotFigure
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={900}
                height={1957}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Detour
