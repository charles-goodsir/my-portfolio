import { Link } from 'react-router'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import { owaspTop10 } from '../data/owaspTop10'
import Button from './ui/Button'
import VisitorBadge from './ui/VisitorBadge'
import { hasFinePointer } from './Play/device'

// The data file is newest first.
const latest = cyberDiaryEntries[0]
const owaspCount = (progress: string) =>
  owaspTop10.filter((r) => r.progress === progress).length

function Home() {
  return (
    <section className="max-w-[45rem] mx-auto px-4 py-24">
      <div className="animate-fade-in">
        <h1 className="text-display font-bold text-ink mb-6">
          Hi, I'm Charles
        </h1>
        <p className="text-lg text-ink-muted mb-6">
          Application Engineer · Moving into DevSecOps and AppSec
        </p>
        <p className="text-base text-ink-muted mb-6 max-w-[55ch]">
          I come from full-stack development. In my own projects I build CI/CD
          pipelines with security gates, SAST and DAST, and fix the application
          security issues they find.
        </p>
        <ul className="text-sm text-ink-muted space-y-1 mb-10">
          <li>
            Latest in Lab Notes:{' '}
            <Link
              to={`/diary/${latest.id}`}
              className="text-primary hover:underline underline-offset-2"
            >
              {latest.title}
            </Link>
          </li>
          <li>
            OWASP Top 10:{' '}
            <Link
              to="/owasp"
              className="text-primary hover:underline underline-offset-2"
            >
              {owaspCount('Completed')} completed, {owaspCount('In progress')}{' '}
              in progress
            </Link>
          </li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button to="/projects" variant="primary">
            View My Work
          </Button>
          <Button to="/diary" variant="secondary">
            Lab Notes
          </Button>
          <a
            href="https://github.com/charles-goodsir"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-colors border border-primary text-primary hover:bg-primary/10"
          >
            GitHub
          </a>
          {/* The map needs a keyboard or mouse, so no button on phones */}
          {hasFinePointer && (
            <Button to="/play" variant="secondary">
              Play CTF Map
            </Button>
          )}
        </div>
      </div>
      <VisitorBadge />
    </section>
  )
}

export default Home
