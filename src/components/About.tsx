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
                I'm Charles Goodsir, a full-stack developer moving into
                application security. I spent years building and shipping
                software in enterprise environments, and that background helps
                when the job is finding flaws in how apps get built, not
                spotting them on a checklist.
              </p>
              <p className="text-gray-700 mb-4">
                I'm{' '}
                <strong className="font-semibold text-gray-800">
                  CompTIA Security+ certified
                </strong>{' '}
                and working through hands-on practice like PortSwigger labs
                with Burp Suite, which I log in my CyberDiary. On the dev side
                I work with React, Node.js, TypeScript, and Python for
                automation and backend tasks.
              </p>
              <p className="text-gray-700 mb-4">
                I'm targeting{' '}
                <strong className="font-semibold text-gray-800">
                  application security
                </strong>{' '}
                roles now, and working toward{' '}
                <strong className="font-semibold text-gray-800">
                  DevSecOps
                </strong>{' '}
                and{' '}
                <strong className="font-semibold text-gray-800">
                  cloud security
                </strong>{' '}
                longer term. I want to be the person who can read the code,
                understand the threat, and help teams fix issues before they
                hit production.
              </p>
              <p className="text-gray-700">
                Outside of labs and projects, I keep up with security news, dig
                into how real-world breaches happened, and write up what I learn
                so I don't forget the details.
              </p>
            </div>
          </div>

          {/* Roles & Interests */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Roles I'm Targeting
            </h3>

            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-600">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Application Security
                </h4>
                <p className="text-gray-700 text-sm">
                  My main focus. Web app testing, secure code review, threat
                  modelling, and helping teams understand risk in software they
                  already ship. Security+ and PortSwigger lab work are building
                  blocks here.
                </p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
                <h4 className="font-semibold text-gray-800 mb-2">DevSecOps</h4>
                <p className="text-gray-700 text-sm">
                  Where I want to grow next. Baking security into CI/CD,
                  automated checks in the pipeline, and working with engineers
                  to catch issues early instead of at release time. My
                  background with Azure DevOps and GitHub gives me a head start
                  on the delivery side.
                </p>
              </div>

              <div className="bg-sky-50 p-4 rounded-lg border-l-4 border-sky-600">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Cloud Security
                </h4>
                <p className="text-gray-700 text-sm">
                  Longer-term goal. Understanding misconfigurations, identity
                  and access in cloud environments, and securing workloads I've
                  actually deployed. I've built serverless apps on AWS and want
                  to go deeper on securing that kind of infrastructure.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Full-Stack Developer
                </h4>
                <p className="text-gray-700 text-sm">
                  Where I come from, and still relevant. React, Node.js,
                  TypeScript, APIs, and databases. Knowing how apps are built
                  end to end makes AppSec work more credible because I can
                  follow a vulnerability from the browser to the backend.
                </p>
              </div>
            </div>

            {/* Key Skills */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Application Security',
                  'CompTIA Security+',
                  'Burp Suite',
                  'Secure Coding',
                  'Threat Modelling',
                  'CI/CD',
                  'React',
                  'TypeScript',
                  'Python',
                  'Node.js',
                  'AWS',
                  'Git',
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
