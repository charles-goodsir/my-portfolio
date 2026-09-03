import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Declarative mode has no <ScrollRestoration>. Reset scroll on pathname change,
 * but leave in-page hash navigation alone.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default ScrollToTop
