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

interface ProjectsProps {
  setActiveSection: (section: string) => void
}

function Projects({ setActiveSection }: ProjectsProps) {
  return (
    <section id="projects" className="bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8">My Projects</h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ul className="space-y-6">
            {projects.map((project) => (
              <li
                key={project.id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection(`project-${project.id}`)}
                    className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Projects
