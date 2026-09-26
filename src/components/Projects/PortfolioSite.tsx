import { Link } from 'react-router'
import Button from '../ui/Button'
import ScreenshotFigure from '../ui/ScreenshotFigure'
import ctfMapImg from '../../assets/CTFMap/CTFMap1.webp'
import { hasFinePointer } from '../Play/device'

function PortfolioSite() {
  return (
    <section className="bg-page py-16 px-4">
      <div className="max-w-[45rem] mx-auto">
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center text-primary hover:underline underline-offset-2 transition-colors duration-300"
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

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-ink">
              Portfolio Website (You are here now!)
            </h1>
            <span className="inline-block bg-warn/10 text-warn px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              Ongoing
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            This site, built with React and TypeScript. It has an optional 3D
            capture-the-flag map, built with Three.js, where each page is a flag
            you drive to
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {[
              'React',
              'TypeScript',
              'Three.js',
              'React Three Fiber',
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

          <div className="flex gap-4">
            <a
              href="https://github.com/charles-goodsir/my-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              This site. It is a single-page React application built with
              TypeScript, Tailwind CSS, and Vite, and deployed to GitHub Pages.
              Client-side routing gives every section and project its own URL so
              a specific page can be linked and shared.
            </p>
            <p className="text-ink-muted mb-4">
              The CyberDiary and OWASP Top 10 sections are data-driven from typed
              content files, with a vulnerability-type filter that is reflected
              in the URL.
            </p>
            <p className="text-ink-muted">
              The build adds a Content Security Policy. GitHub Pages cannot send
              response headers, so the policy goes in a meta tag, and the one
              inline script is allowed by its hash.
            </p>
          </div>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mt-8">
          <h2 className="text-2xl font-bold text-ink mb-6">CTF Map</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              The Play CTF Map button on the home page opens a 3D arena styled on
              the grid from Tron. You drive a small program called the Bit around
              it, and each page of the site is a flag. Get close to one and press
              Enter to open that page. It needs a keyboard or a mouse, so it is
              not offered on phones, and the normal site stays the default.
            </p>
            <p className="text-ink-muted mb-4">
              All the 3D code is in its own chunk that only downloads when
              someone opens the map, so the rest of the site grew by about 1 KB.
              The fonts are bundled with the site instead of loaded from Google
              Fonts, so the map makes no third-party requests.
            </p>
            <p className="text-ink-muted mb-6">
              There is also a real flag hidden on the map.
            </p>
          </div>

          <ScreenshotFigure
            src={ctfMapImg}
            alt="The CTF map: a glowing cyan grid arena with orange flags, each labelled with a page of the site, and a hologram panel previewing CyberDiary"
            width={2874}
            height={1550}
            className="mb-6"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            {hasFinePointer && (
              <Button to="/play" variant="primary">
                Play the map
              </Button>
            )}
            <Button to="/diary/ctf-map-entry-1-game-mode-and-hidden-flag" variant="secondary">
              Read the diary entry
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioSite
