import Me from '../assets/MyPic/me.webp'

const CV = `${import.meta.env.BASE_URL}Charles_Goodsir_CV.pdf`

function About() {
  return (
    <section id="about" className="max-w-[45rem] mx-auto py-16 px-4">
      <div className="bg-card border border-line rounded-lg shadow-card p-8">
        <div className="text-center mb-8">
          <img
            src={Me}
            alt="Charles Goodsir"
            width={224}
            height={224}
            loading="eager"
            decoding="async"
            className="w-56 h-56 rounded-full mx-auto mb-6 object-cover border-4 border-line shadow-card"
          />
          <h1 className="text-3xl font-semibold text-ink mb-4">About Me</h1>
          <a
            href={CV}
            download="Charles_Goodsir_CV.pdf"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors font-semibold shadow-card"
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
            <h3 className="text-2xl font-semibold text-ink mb-4">
              My Story
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-ink-muted mb-4">
                I'm Charles Goodsir, an Application Engineer working toward
                DevSecOps. I've spent years building enterprise software and
                shipping it through CI/CD pipelines. Now I'm adding security
                checks to those pipelines, so they flag problems before
                release.
              </p>
              <p className="text-ink-muted mb-4">
                I'm{' '}
                <strong className="font-semibold text-ink">
                  CompTIA Security+ certified
                </strong>{' '}
                and I work through PortSwigger's labs in Burp Suite, logging
                each one in my CyberDiary. On the dev side I use React,
                Node.js, TypeScript, and Python.
              </p>
              <p className="text-ink-muted mb-4">
                I'm targeting{' '}
                <strong className="font-semibold text-ink">
                  DevOps and DevSecOps
                </strong>{' '}
                roles: CI/CD, deployment gates, and the security tools inside
                them. Application security is my specialty within that. I
                want to find a flaw in the code, then add the pipeline check
                that stops it shipping.
              </p>
              <p className="text-ink-muted">
                Outside labs and projects, I read about real breaches and
                write notes on how they happened, so I remember the details.
              </p>
            </div>
          </div>

          {/* Roles & Interests */}
          <div>
            <h3 className="text-2xl font-semibold text-ink mb-4">
              Roles I'm Targeting
            </h3>

            <div className="space-y-4">
              <div className="bg-sunken p-4 rounded-lg">
                <h4 className="font-semibold text-ink mb-2">
                  DevOps / DevSecOps
                </h4>
                <p className="text-ink-muted text-sm">
                  My main focus: automated security scanning and deployment
                  gates in CI/CD, working with engineers to catch issues
                  before release. I built this into the appsec-homelab
                  pipeline (SAST, secrets scanning, SCA, container scanning,
                  DAST). I already know Azure DevOps and GitHub Actions from
                  delivery work.
                </p>
              </div>

              <div className="bg-sunken p-4 rounded-lg">
                <h4 className="font-semibold text-ink mb-2">
                  Application Security
                </h4>
                <p className="text-ink-muted text-sm">
                  My specialty inside the pipeline: web app testing, secure
                  code review, and fixing the vulnerabilities I find. I back
                  it with Security+ and PortSwigger lab work.
                </p>
              </div>

              <div className="bg-sunken p-4 rounded-lg">
                <h4 className="font-semibold text-ink mb-2">
                  Full-Stack Foundation
                </h4>
                <p className="text-ink-muted text-sm">
                  My background: React, Node.js, TypeScript, APIs, and
                  databases. I know how an app fits together end to end, so I
                  can trace a vulnerability from the browser to the backend
                  and follow the fix through deployment.
                </p>
              </div>
            </div>

            {/* Key Skills */}
            <div className="mt-6">
              <h4 className="font-semibold text-ink mb-3">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Application Security',
                  'CompTIA Security+',
                  'Burp Suite',
                  'Secure Coding',
                  'Threat Modelling',
                  'CI/CD',
                  'Terraform',
                  'Azure',
                  'Docker',
                  'React',
                  'TypeScript',
                  'Python',
                  'Node.js',
                  'AWS',
                  'Git',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-sunken text-ink-muted px-3 py-1 rounded-full text-sm font-medium"
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
