interface ExperienceItem {
  title: string
  company: string
  location: string
  duration: string
  description: string[]
  technologies: string[]
}

const experiences: ExperienceItem[] = [
  {
    title: 'Software Configuration Engineer – Finance Domain',
    company: 'DATACOM SOLUTIONS (NZ)',
    location: 'Auckland, New Zealand',
    duration: 'Sept 2021 - Current',
    description: [
      'Designed, coded/configured, tested, and delivered applications across multiple regions within NZ & Australia',
      'Conducted automation testing using Gherkin scripts to validate end-to-end business processes, guaranteeing thorough quality assurance',
      'Collaborated with cross functional domain teams to configure solutions aligning with business requirements',
      'Worked closely with BAs, developers, configurators, product managers, and clients to deliver features in a large enterprise environment',
      'Automated workflows using in-house power tools for local government councils',
      'Led weekly CRM/ERP overview and training sessions and demoed new features in external sprint reviews',
      'Optimised and remodelled configuration to improve system performance, reducing runtime from 2.5 minutes to 20 seconds',
      'Developed technical documentation through Confluence articles to support internal releases',
      'Provided training for associate analysts and offered continuous advice, guidance, and mentorship on duties and best practices',
    ],
    technologies: [
      'GitHub',
      'JSON',
      'Azure DevOps',
      'CI/CD Pipelines',
      'GIT',
      'YAML',
      'Automation Testing',
      'Confluence',
      'Agile Methodology',
    ],
  },
  {
    title: 'Service Desk Analyst',
    company: 'DATACOM SOLUTIONS (NZ)',
    location: 'Wellington, New Zealand',
    duration: 'Sept 2020 – Sept 2021',
    description: [
      'Provided first-level support for Ministry of Business, Innovation and Employment - documenting each call verifying customer information',
      'Researched, resolved, and responded to questions received via telephone calls, emails, and call-backs in a timely manner',
      'Escalated problems to appropriate individuals when necessary',
      'Assisted in the resolution of user and support issues among company sites to ensure timely distribution of knowledge',
      'Maintained positive impact on user satisfaction through effective problem resolution',
    ],
    technologies: [
      'Customer Support',
      'Problem Resolution',
      'Documentation',
      'Communication',
      'Ticketing Systems',
    ],
  },
]

function Experience() {
  return (
    <section id="experience" className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold mb-8">Professional Experience</h2>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{exp.title}</h3>
                <p className="text-lg text-blue-600 font-semibold">
                  {exp.company}
                </p>
                <p className="text-gray-600">{exp.location}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {exp.duration}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <ul className="space-y-2">
                {exp.description.map((desc, descIndex) => (
                  <li
                    key={descIndex}
                    className="text-gray-700 flex items-start"
                  >
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills Translation Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6">
          Why I'm Ready for Coding Roles
        </h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 border-l-4 border-indigo-600">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Technical Foundation
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
                  <span>
                    <strong>Version Control & CI/CD:</strong> Extensive
                    experience with GitHub, Azure DevOps, and automated
                    deployment pipelines
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
                  <span>
                    <strong>Testing & Quality Assurance:</strong> Conducted
                    automation testing using Gherkin scripts and end-to-end
                    validation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
                  <span>
                    <strong>Configuration & Architecture:</strong> Designed and
                    implemented scalable solutions across multiple regions
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
                  <span>
                    <strong>Documentation & Best Practices:</strong> Created
                    technical documentation and mentored team members
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Professional Skills
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
                  <span>
                    <strong>Problem Solving:</strong> Optimized system
                    performance, reducing runtime from 2.5 minutes to 20 seconds
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
                  <span>
                    <strong>Cross-functional Collaboration:</strong> Worked with
                    BAs, developers, product managers, and clients in enterprise
                    environments
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
                  <span>
                    <strong>Leadership & Training:</strong> Led training
                    sessions and provided mentorship to junior team members
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-1">•</span>
                  <span>
                    <strong>Agile Methodology:</strong> Experienced in agile
                    development processes and sprint-based delivery
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
            <p className="text-gray-700 text-center font-medium">
              <strong>
                Combined with my recent Full Stack Development training at Dev
                Academy Aotearoa,
              </strong>
              these professional experiences provide a strong foundation for
              transitioning into hands-on coding roles, bringing both technical
              expertise and proven ability to deliver high-quality software
              solutions in collaborative environments.
            </p>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6">Education</h3>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Level 6 in Applied Software Development
                </h4>
                <p className="text-lg text-green-600 font-semibold">
                  Dev Academy Aotearoa
                </p>
                <p className="text-gray-600">Auckland, New Zealand</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Jul 2024 - Dec 2024
                </span>
              </div>
            </div>
            <p className="text-gray-700">
              Intensive 17-week full-stack development bootcamp covering modern
              web technologies including JavaScript, TypeScript, React, Node.js,
              and database management. Gained hands-on experience in agile
              development methodologies, pair programming, and collaborative
              project delivery. Successfully led a team in building and
              deploying full-stack applications, demonstrating strong technical
              leadership and project management skills.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Bachelor of Arts, History, International Relations, Political
                  Science
                </h4>
                <p className="text-lg text-green-600 font-semibold">
                  Victoria University of Wellington
                </p>
                <p className="text-gray-600">Wellington, New Zealand</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Feb 2017 - Jan 2020
                </span>
              </div>
            </div>
            <p className="text-gray-700">
              Comprehensive undergraduate degree combining historical analysis,
              international relations theory, and political science methodology.
              Developed strong critical thinking, research, and analytical
              skills through extensive academic writing and independent research
              projects. Gained valuable experience in presenting complex ideas,
              conducting thorough research, and working collaboratively on group
              projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
