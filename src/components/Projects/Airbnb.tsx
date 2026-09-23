import { Link } from 'react-router'
import ScreenshotFigure from '../ui/ScreenshotFigure'
import img1 from '../../assets/AirBnB/airbnb-1.webp'
import img2 from '../../assets/AirBnB/airbnb-2.webp'

function Airbnb() {
  const images = [
    { src: img1, alt: 'Airbnb Clone - Homepage', width: 1400, height: 538 },
    {
      src: img2,
      alt: 'Airbnb Clone - Calendar Selection',
      width: 1400,
      height: 482,
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
              Airbnb Clone - Homepage
            </h1>
            <span className="inline-block bg-success/10 text-success px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              Complete
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            A basic React homepage that replicates the Airbnb interface design
          </p>
          <p className="text-xl text-ink-muted mb-6">
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
                className="border border-line bg-sunken text-ink-muted px-3 py-1.5 rounded-md font-mono text-xs"
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
              An Airbnb homepage clone built early on, while I was still
              learning React component structure and state.
            </p>
            <p className="text-ink-muted">
              The interesting part is the calendar — a date-range picker built
              from scratch rather than pulled from a library, which is what
              forced me to actually understand how React state and event
              handling fit together. It's not meant to be more than that: a
              small clone, not a product.
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
                Interactive Calendar
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Date range picking, built from scratch</li>
                <li>• Calendar navigation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                UI/UX Design
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Airbnb-inspired design</li>
              </ul>
            </div>
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
    </section>
  )
}

export default Airbnb
