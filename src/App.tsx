import { useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Project'
import Contact from './components/Contact'
import Detour from './components/Projects/Detour'

function App() {
  const [activeSection, setActiveSection] = useState('home')

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
      case 'contact':
        return <Contact />
      case 'project-detour':
        return <Detour setActiveSection={setActiveSection} />
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
