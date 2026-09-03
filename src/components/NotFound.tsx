import { Link } from 'react-router'

function NotFound() {
  return (
    <section className="max-w-4xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-semibold text-ink mb-3">
        Page not found
      </h1>
      <p className="text-ink-muted mb-6">
        That page does not exist. Check the address, or start from the home page.
      </p>
      <Link
        to="/"
        className="text-primary hover:underline underline-offset-2 font-medium underline underline-offset-2"
      >
        Back to home
      </Link>
    </section>
  )
}

export default NotFound
