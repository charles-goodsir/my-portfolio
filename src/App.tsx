import { HashRouter, Routes, Route } from 'react-router'
import RootLayout from './components/ui/RootLayout'
import Home from './components/Home'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Project'
import Contact from './components/Contact'
import CyberDiary from './components/CyberDiary'
import DiaryEntry from './components/DiaryEntry'
import OwaspTop10 from './components/OWASP'
import NotFound from './components/NotFound'
import Detour from './components/Projects/Detour'
import FlightTracker from './components/Projects/FlightTracker'
import NewsDashboard from './components/Projects/NewsDashboard'
import Airbnb from './components/Projects/Airbnb'
import FinanceTracker from './components/Projects/FinanceTracker'
import PortfolioSite from './components/Projects/PortfolioSite'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="experience" element={<Experience />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/detour" element={<Detour />} />
          <Route path="projects/finance-tracker" element={<FinanceTracker />} />
          <Route path="projects/flight-tracker" element={<FlightTracker />} />
          <Route path="projects/news-dashboard" element={<NewsDashboard />} />
          <Route path="projects/airbnb" element={<Airbnb />} />
          <Route path="projects/portfolio" element={<PortfolioSite />} />
          <Route path="diary" element={<CyberDiary />} />
          <Route path="diary/:entryId" element={<DiaryEntry />} />
          <Route path="owasp" element={<OwaspTop10 />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
