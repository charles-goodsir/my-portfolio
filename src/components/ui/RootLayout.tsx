import { Outlet } from 'react-router'
import Nav from './Nav'
import ScrollToTop from './ScrollToTop'

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:bg-card focus:px-4 focus:py-2 focus:rounded focus:shadow-card"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="bg-page">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <div className="max-w-[45rem] mx-auto px-4 py-8 text-sm text-ink-muted">
          Charles Goodsir
        </div>
      </footer>
    </>
  )
}

export default RootLayout
