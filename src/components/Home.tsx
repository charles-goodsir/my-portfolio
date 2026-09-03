import Button from './ui/Button'

function Home() {
  return (
    <section className="max-w-[45rem] mx-auto px-4 py-24">
      <div className="animate-fade-in">
        <h1 className="text-display font-bold text-ink mb-6">Hi, I'm Charles</h1>
        <p className="text-lg text-ink-muted mb-6">
          Application Security Engineer · CompTIA Security+ Certified
        </p>
        <p className="text-base text-ink-muted mb-10 max-w-[55ch]">
          Full-stack background, application security focus. Working toward
          DevSecOps and cloud security roles where building software and breaking
          it are the same job.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button as="link" to="/projects" variant="primary">
            View My Work
          </Button>
          <Button as="link" to="/diary" variant="secondary">
            Cyber Diary
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Home
