interface HeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

function Header({ activeSection, setActiveSection }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'cyberdiary', label: 'CyberDiary' },
    { id: 'owasptop10', label: 'OWASP Top 10' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-blue-600">Charles Goodsir</h1>
        <nav className="space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`transition-colors duration-300 ${
                activeSection === item.id
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
