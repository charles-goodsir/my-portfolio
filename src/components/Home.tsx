import Button from './ui/Button'
import VisitorBadge from './ui/VisitorBadge'
import { hasFinePointer } from './Play/device'

function Home() {
  return (
    <section className="max-w-[45rem] mx-auto px-4 py-24">
      <div className="animate-fade-in">
        <h1 className="text-display font-bold text-ink mb-6">Hi, I'm Charles</h1>
        <p className="text-lg text-ink-muted mb-6">
          Application Engineer · Building DevSecOps Capability
        </p>
        <p className="text-base text-ink-muted mb-10 max-w-[55ch]">
          Full-stack background, now wiring security into the pipelines I
          build in - CI/CD gates, SAST/DAST, and the application security
          work underneath both.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button to="/projects" variant="primary">
            View My Work
          </Button>
          <Button to="/diary" variant="secondary">
            Cyber Diary
          </Button>
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
