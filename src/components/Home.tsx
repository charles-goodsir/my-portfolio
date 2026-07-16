interface HomeProps {
  setActiveSection: (section: string) => void
}

function Home({ setActiveSection }: HomeProps) {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Hi, I'm <span className="text-blue-600">Charles</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Full-Stack Developer · CompTIA Security+ Certified
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            I build clean, user-friendly applications with modern web
            technologies, and I'm moving toward IT and security-focused roles
            where solid engineering and security both matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveSection('projects')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View My Work
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Get In Touch
            </button>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-indigo-300 rounded-full opacity-20 animate-float-delayed"></div>
      </div>
    </section>
  )
}

export default Home
