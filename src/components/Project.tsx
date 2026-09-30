import { Link } from 'react-router'
import Card from './ui/Card'
import SectionHeader from './ui/SectionHeader'
import Tag from './ui/Tag'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
}

const securityProjects: Project[] = [
  {
    id: 'appsec-homelab',
    title: 'AppSec Homelab',
    description:
      'A deliberately vulnerable ASP.NET Core / React app that I built, broke, and fixed, wrapped in two parallel CI/CD security pipelines (GitHub Actions and Azure Pipelines) with staged deployment gates and a piece of Terraform-managed infrastructure on Azure',
    technologies: [
      'ASP.NET Core 8',
      'React',
      'Docker',
      'GitHub Actions',
      'Azure Pipelines',
      'Semgrep',
      'OWASP ZAP',
      'Terraform',
      'Azure',
    ],
  },
  {
    id: 'secure-azure-landing-zone',
    title: 'Secure Azure Landing Zone',
    description:
      'A Terraform-managed Azure landing zone built pipeline-first: validate, Trivy scan, plan, and a manual approval gate before anything reaches Azure. The first resources are live',
    technologies: ['Terraform', 'Azure DevOps', 'Azure', 'Trivy', 'YAML'],
  },
  {
    id: 'portfolio',
    title: 'Portfolio Site',
    description:
      'This site, built with React and TypeScript. It has an optional 3D capture-the-flag map, built with Three.js, where each page is a flag you drive to',
    technologies: [
      'React',
      'TypeScript',
      'Three.js',
      'React Three Fiber',
      'Tailwind CSS',
      'Vite',
    ],
  },
]

const earlierProjects: Project[] = [
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
      'A personal finance app with a FastAPI backend on AWS Lambda and automated transaction tracking',
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
]

function Projects() {
  return (
    <section id="projects" className="max-w-[45rem] mx-auto py-16 px-4">
      <SectionHeader title="My Projects" />

      <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">
        Security work
      </h2>
      <ul className="space-y-4">
        {securityProjects.map((project) => (
          <li key={project.id}>
            <Card to={`/projects/${project.id}`}>
              <h3 className="text-xl font-bold text-ink mb-2">
                {project.title}
              </h3>
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

      <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mt-14 mb-2">
        Earlier projects
      </h2>
      <ul className="divide-y divide-line border-y border-line">
        {earlierProjects.map((project) => (
          <li key={project.id} className="py-4">
            <Link
              to={`/projects/${project.id}`}
              className="font-medium text-ink hover:text-primary hover:underline underline-offset-2"
            >
              {project.title}
            </Link>
            <p className="text-sm text-ink-muted mt-1">{project.description}</p>
            <p className="text-xs text-ink-muted mt-1.5">
              {project.technologies.join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Projects
