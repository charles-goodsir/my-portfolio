import Card from './ui/Card'
import SectionHeader from './ui/SectionHeader'
import Tag from './ui/Tag'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
}

const projects: Project[] = [
  {
    id: 'detour',
    title: 'Detour',
    description:
      'A mobile app for discovering local attractions and creating custom routes',
    technologies: ['React Native', 'TypeScript', 'Supabase', 'Apple Maps API'],
  },
  {
    id: 'finance-tracker',
    title: 'Finance Tracker 2.0',
    description:
      'A comprehensive personal finance management application with FastAPI backend, AWS serverless architecture, and automated transaction tracking',
    technologies: [
      'Python',
      'FastAPI',
      'AWS Lambda',
      'DynamoDB',
      'JavaScript',
      'Progressive Web App',
      'Telegram Bot API',
      'Serverless',
    ],
  },
  {
    id: 'flight-tracker',
    title: 'Flight Tracker',
    description:
      'An automated flight tracking system that monitors flights and sends notifications via Discord and Telegram',
    technologies: [
      'Python',
      'AWS Lightsail',
      'Discord Bot API',
      'Telegram Bot API',
      'Linux VM',
    ],
  },
  {
    id: 'news-dashboard',
    title: 'News Dashboard',
    description:
      'A full-stack news aggregation dashboard with Python web scraping, database population, and React frontend',
    technologies: [
      'React',
      'TypeScript',
      'Python',
      'Web Scraping',
      'Database',
      'Tailwind CSS',
      'Vite',
    ],
  },
  {
    id: 'airbnb',
    title: 'Airbnb Clone - Homepage',
    description:
      'A basic React homepage with interactive calendar and date selection functionality',
    technologies: ['React', 'JavaScript', 'CSS', 'Date Picker', 'Material UI'],
  },

  {
    id: 'portfolio',
    title: 'Portfolio Website (You are here now!)',
    description:
      'A responsive portfolio website built with React and TypeScript',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
]

function Projects() {
  return (
    <section id="projects" className="max-w-[45rem] mx-auto py-16 px-4">
      <SectionHeader title="My Projects" />
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id}>
            <Card to={`/projects/${project.id}`}>
              <h2 className="text-xl font-bold text-ink mb-2">{project.title}</h2>
              <p className="text-ink-muted text-sm mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
              <span className="text-primary text-sm font-medium">
                View details →
              </span>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Projects
