import { useCallback, useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Project'
import Contact from './components/Contact'
import CyberDiary from './components/CyberDiary'
import Detour from './components/Projects/Detour'
import FlightTracker from './components/Projects/FlightTracker'
import NewsDashboard from './components/Projects/NewsDashboard'
import Airbnb from './components/Projects/Airbnb'
import FinanceTracker from './components/Projects/FinanceTracker'
import OwaspTop10 from './components/OWASP'

function App() {
  const [scrollToEntryId, setScrollToEntryId] = useState<string | null>(null)
  const [scrollToVulnType, setScrollToVulnType] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('home')

  const navigateToDiary = (entryId: string, vulnType: string) => {
    setScrollToEntryId(entryId)
    setScrollToVulnType(vulnType)
    setActiveSection('cyberdiary')
  }

  const handleScrollHandled = useCallback(() => {
    setScrollToEntryId(null)
    setScrollToVulnType(null)
  }, [])

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home setActiveSection={setActiveSection} />
      case 'about':
        return <About />
      case 'experience':
        return <Experience />
      case 'projects':
        return <Projects setActiveSection={setActiveSection} />
      case 'cyberdiary':
        return (
          <CyberDiary
            scrollToEntryId={scrollToEntryId}
            scrollToVulnType={scrollToVulnType}
            onScrollHandled={handleScrollHandled}
          />
        )
      case 'owasptop10':
        return <OwaspTop10 navigateToDiary={navigateToDiary} />
      case 'contact':
        return <Contact />
      case 'project-detour':
        return <Detour setActiveSection={setActiveSection} />
      case 'project-flight-tracker':
        return <FlightTracker setActiveSection={setActiveSection} />
      case 'project-news-dashboard':
        return <NewsDashboard setActiveSection={setActiveSection} />
      case 'project-airbnb':
        return <Airbnb setActiveSection={setActiveSection} />
      case 'project-finance-tracker':
        return <FinanceTracker setActiveSection={setActiveSection} />
      default:
        return <Home setActiveSection={setActiveSection} />
    }
  }

  return (
    <>
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main>{renderSection()}</main>
    </>
  )
}

export default App
