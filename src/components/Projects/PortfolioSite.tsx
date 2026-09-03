import { Link } from 'react-router'

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
          <h1 className="text-4xl font-bold text-ink mb-4">
            Portfolio Website (You are here now!)
          </h1>
          <p className="text-xl text-ink-muted mb-6">
            A responsive portfolio website built with React and TypeScript
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {['React', 'TypeScript', 'Tailwind CSS', 'Vite'].map((tech) => (
              <span
                key={tech}
                className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold"
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
            <p className="text-ink-muted">
              The CyberDiary and OWASP Top 10 sections are data-driven from typed
              content files, with a vulnerability-type filter that is reflected
              in the URL.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioSite
