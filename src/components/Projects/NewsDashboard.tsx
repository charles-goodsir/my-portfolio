import { Link } from 'react-router'
import ScreenshotFigure from '../ui/ScreenshotFigure'
import img1 from '../../assets/NewsDashboard/news-1.webp'
import img2 from '../../assets/NewsDashboard/news-2.webp'
import img3 from '../../assets/NewsDashboard/news-3.webp'

function NewsDashboard() {
  const images = [
    { src: img1, alt: 'News Dashboard - Main View', width: 1400, height: 1116 },
    {
      src: img2,
      alt: 'News Dashboard - Category Filter',
      width: 1400,
      height: 914,
    },
    {
      src: img3,
      alt: 'News Dashboard - Article Details',
      width: 1400,
      height: 1289,
    },
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
            <h1 className="text-4xl font-bold text-ink">
              News Dashboard
            </h1>
            <span className="inline-block bg-success/10 text-success px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              Complete
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            A full-stack news aggregation dashboard with Python web scraping,
            database population, and React frontend.
          </p>
          <p className="text-xl text-ink-muted mb-6">
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
                className="border border-line bg-sunken text-ink-muted px-3 py-1.5 rounded-md font-mono text-xs"
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
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              View on GitHub
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
              News Dashboard pairs Python scripts that scrape news sites and
              pull crypto and weather data with a React/TypeScript frontend
              that reads it back out. The scripts run on a schedule, clean and
              store what they collect, and the frontend adds category
              filtering and a dashboard view on top.
            </p>
            <p className="text-ink-muted">
              I built it to get comfortable owning both ends of a pipeline —
              the thing that collects the data and the thing that displays it
              — instead of just consuming someone else's API.
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
                Python Web Scraping
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Crypto market data collection</li>
                <li>• Weather API integration</li>
                <li>• Scheduled data updates</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Database Management
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Automated database population</li>
                <li>• Data cleaning and validation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                React Frontend
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Category filtering and search</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Screenshots - Full Width Section */}
        <div className="">
          <div className="max-w-[45rem] mx-auto">
            <h2 className="text-2xl font-bold text-ink mb-6">
              Project Screenshots
            </h2>
          </div>
          <div className="max-w-[45rem] mx-auto space-y-6">
            {images.map((image) => (
              <ScreenshotFigure
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsDashboard
