import { useEffect, useId, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { navItems } from './navItems'

function linkClass({ isActive }: { isActive: boolean }) {
  return `transition-colors ${
    isActive
      ? 'text-primary font-semibold'
      : 'text-ink-muted hover:text-primary'
  }`
}

function Nav() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const { pathname } = useLocation()

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="bg-card border-b border-line sticky top-0 z-10">
      <div className="max-w-[45rem] mx-auto flex justify-between items-center p-4">
        <NavLink to="/" end className="text-xl font-bold text-ink">
          Charles Goodsir
        </NavLink>

        <nav className="hidden md:flex md:gap-5 md:text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden text-ink-muted hover:text-primary"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav
          id={menuId}
          className="md:hidden border-t border-line px-4 pb-4 pt-2 flex flex-col space-y-3"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Nav
