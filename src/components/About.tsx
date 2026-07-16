import Me from '../assets/MyPic/Me.jpeg'
import CV from '../assets/CV/Charles_Goodsir_CV.pdf'

function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <img
            src={Me}
            alt="Charles Goodsir"
            className="w-56 h-56 rounded-full mx-auto mb-6 object-cover border-4 border-blue-100 shadow-lg"
          />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About Me</h2>
          <a
            href={CV}
            download="Charles_Goodsir_CV.pdf"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CV
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Personal Story */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              My Story
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                I'm Charles Goodsir, a full-stack developer. I like shipping
                software that solves a real problem, not just code for its own
                sake. I got into tech from wanting to know how systems actually
                work, and that curiosity is still what drives most of what I do.
              </p>
              <p className="text-gray-700 mb-4">
                I work mainly with React, Node.js, TypeScript, and the usual
                modern web stack. I'm building clean, scalable apps with a focus
                on good UX. I'm also picking up Python for data work,
                automation, and backend tasks.
              </p>
              <p className="text-gray-700 mb-4">
                I hold{' '}
                <strong className="font-semibold text-gray-800">
                  CompTIA Security+
                </strong>{' '}
                and I'm open to roles where software, IT operations, and
                security meet: secure development, IT security support,
                engineering with security in mind, or broader cybersecurity
                work.
              </p>
              <p className="text-gray-700 mb-4">
                I like projects that fix something annoying or important for
                users. I want to keep levelling up my Python so I can take on
                bigger, messier problems.
              </p>
              <p className="text-gray-700">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community.
              </p>
            </div>
          </div>

          {/* Roles & Interests */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Roles I'm Passionate About
            </h3>

            <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-600">
              <h4 className="font-semibold text-gray-800 mb-2">
                IT &amp; Security-Focused Roles
              </h4>
              <p className="text-gray-700 text-sm">
                Building on service-desk experience and my Security+
                certification, I'm keen on roles such as IT security support,
                junior security or SOC-adjacent positions, secure software
                delivery, and technical paths where risk, identity, and resilient
                systems matter.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Full-Stack Developer
                </h4>
                <p className="text-gray-700 text-sm">
                Building end-to-end applications with modern frameworks and
                technologies. I like wiring the UI to the backend so the whole
                flow feels coherent for users.
                </p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Data Engineer
                </h4>
                <p className="text-gray-700 text-sm">
                  Currently learning Python for data pipelines, web scraping,
                  and automated data collection. I'm getting comfortable with
                  Python's data tooling so I can turn messy inputs into
                  something people can actually use.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Software Engineer
                </h4>
                <p className="text-gray-700 text-sm">
                  Solid, scalable software with tests where they help and
                  structure that won't confuse the next person. I care about
                  readable code and systems that keep running without drama.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Frontend Developer
                </h4>
                <p className="text-gray-700 text-sm">
                  Responsive layouts and components that behave predictably. I
                  try to keep complex flows understandable so users aren't
                  guessing what to do next.
                </p>
              </div>
            </div>

            {/* Key Skills */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'React',
                  'TypeScript',
                  'Python',
                  'Node.js',
                  'Web Scraping',
                  'Database Design',
                  'API Development',
                  'Tailwind CSS',
                  'Git',
                  'CompTIA Security+',
                  'Problem Solving',
                  'Team Collaboration',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
