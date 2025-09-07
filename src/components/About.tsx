import Me from '../assets/MyPic/Me.jpeg'
import CV from '../assets/CV/CharlesGoodsir.pdf'

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
                I'm Charles Goodsir, a passionate full-stack developer with a
                love for creating innovative solutions and bringing ideas to
                life through code. My journey in technology began with a
                curiosity for how things work and has evolved into a career
                focused on building meaningful applications.
              </p>
              <p className="text-gray-700 mb-4">
                With expertise in React, Node.js, TypeScript, and modern web
                technologies, I specialize in building clean, scalable
                applications that provide exceptional user experiences. I'm
                currently learning Python and am eager to dive deeper into its
                capabilities for data science, automation, and backend
                development.
              </p>
              <p className="text-gray-700 mb-4">
                I'm particularly drawn to projects that solve real-world
                problems and make a positive impact, and I'm excited to expand
                my skills with Python to tackle even more complex challenges.
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
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Full-Stack Developer
                </h4>
                <p className="text-gray-700 text-sm">
                  Building end-to-end applications with modern frameworks and
                  technologies. I love the challenge of creating seamless user
                  experiences from frontend to backend.
                </p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Data Engineer
                </h4>
                <p className="text-gray-700 text-sm">
                  Currently learning Python for data pipelines, web scraping
                  solutions, and automated data collection systems. I'm excited
                  to master Python's data science libraries and turn raw data
                  into actionable insights.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Software Engineer
                </h4>
                <p className="text-gray-700 text-sm">
                  Creating robust, scalable software solutions. I'm passionate
                  about clean code, best practices, and building systems that
                  stand the test of time.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Frontend Developer
                </h4>
                <p className="text-gray-700 text-sm">
                  Crafting beautiful, responsive user interfaces that delight
                  users. I focus on creating intuitive experiences that make
                  complex functionality simple.
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
