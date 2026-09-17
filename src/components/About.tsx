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
                I'm Charles Goodsir, a full-stack developer building toward
                DevSecOps. I spent years building and shipping software in
                enterprise environments, then years working inside CI/CD
                pipelines to ship it — that combination is what I'm putting
                to work now: baking security into the pipeline instead of
                bolting it on afterward.
              </p>
              <p className="text-ink-muted mb-4">
                I'm{' '}
                <strong className="font-semibold text-ink">
                  CompTIA Security+ certified
                </strong>{' '}
                and working through hands-on practice like PortSwigger labs
                with Burp Suite, which I log in my CyberDiary. On the dev side
                I work with React, Node.js, TypeScript, and Python for
                automation and backend tasks.
              </p>
              <p className="text-ink-muted mb-4">
                I'm targeting{' '}
                <strong className="font-semibold text-ink">
                  DevOps and DevSecOps
                </strong>{' '}
                roles — CI/CD, deployment gates, and the security tooling
                that sits inside them. Application security is the specialty
                I bring to that: I want to be the person who can read the
                code, understand the threat, and wire the pipeline to catch
                it before it ships.
              </p>
              <p className="text-ink-muted">
                Outside of labs and projects, I keep up with security news, dig
                into how real-world breaches happened, and write up what I learn
                so I don't forget the details.
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
                  My main focus. Baking security into CI/CD — automated
                  scanning, deployment gates, and working with engineers to
                  catch issues early instead of at release time. Built and
                  evidenced in the appsec-homelab pipeline (SAST, secrets
                  scanning, SCA, container scanning, DAST). My background with
                  Azure DevOps and GitHub Actions gives me a head start on the
                  delivery side.
                </p>
              </div>

              <div className="bg-sunken p-4 rounded-lg">
                <h4 className="font-semibold text-ink mb-2">
                  Application Security
                </h4>
                <p className="text-ink-muted text-sm">
                  The specialty inside that pipeline. Web app testing, secure
                  code review, and finding + fixing real vulnerability
                  classes — not just spotting them on a checklist. Security+
                  and PortSwigger lab work are the building blocks here.
                </p>
              </div>

              <div className="bg-sunken p-4 rounded-lg">
                <h4 className="font-semibold text-ink mb-2">
                  Full-Stack Foundation
                </h4>
                <p className="text-ink-muted text-sm">
                  Where I come from, and still what makes the rest credible.
                  React, Node.js, TypeScript, APIs, and databases. Knowing how
                  apps are built end to end means I can follow a vulnerability
                  from the browser to the backend, and follow the fix through
                  a real deployment pipeline.
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
