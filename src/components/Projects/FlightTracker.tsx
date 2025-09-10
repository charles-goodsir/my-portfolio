import Screenshot1 from '../../assets/Flight-Tracker/Screenshot1.jpeg'

interface FlightTrackerProps {
  setActiveSection: (section: string) => void
}

function FlightTracker({ setActiveSection }: FlightTrackerProps) {
  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setActiveSection('projects')}
          className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Flight Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            An automated flight tracking system that monitors flights and sends
            notifications via Discord and Telegram
          </p>
          <p className="text-xl text-gray-600 mb-6">
            This Python script runs on AWS Lightsail Linux VM and automatically
            tracks flights every 3 hours, sending real-time updates to
            configured channels.
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              'Python',
              'AWS Lightsail',
              'Linux VM',
              'Discord Bot API',
              'Telegram Bot API',
              'Flight API',
              'Cron Jobs',
              'REST APIs',
            ].map((tech) => (
              <span
                key={tech}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Project Links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/charles-goodsir/flight-tracker#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 font-semibold"
            >
              View Code
            </a>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              The Flight Tracker is an automated monitoring system designed to
              track specific flight numbers and provide real-time updates
              through Discord and Telegram notifications. Built with Python and
              deployed on AWS Lightsail, this system runs continuously on a
              Linux VM to ensure reliable flight monitoring.
            </p>
            <p className="text-gray-700 mb-4">
              The system integrates with flight tracking APIs to fetch real-time
              flight data including departure times, arrival times, delays, gate
              information, and current status. When a flight number is added to
              the tracking list, the system automatically begins monitoring it
              every 3 hours using cron jobs for scheduling.
            </p>
            <p className="text-gray-700 mb-4">
              Notifications are sent through both Discord and Telegram bot APIs,
              providing users with comprehensive updates about their tracked
              flights. The system handles various flight statuses including
              on-time, delayed, cancelled, and completed flights, ensuring users
              stay informed throughout their journey.
            </p>
            <p className="text-gray-700">
              This project demonstrates expertise in cloud deployment, API
              integration, automation, and real-time data processing using
              Python in a production environment.
            </p>
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            System Architecture
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Infrastructure
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• AWS Lightsail Linux VM hosting</li>
                <li>• Python 3.9+ runtime environment</li>
                <li>• Cron job scheduling for automation</li>
                <li>• Log file management and rotation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Data Flow
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Flight API data fetching</li>
                <li>• Data parsing and validation</li>
                <li>• Status change detection</li>
                <li>• Multi-channel notification delivery</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Flight Monitoring
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Real-time flight status tracking</li>
                <li>• Automatic 3-hour update intervals</li>
                <li>• Support for multiple flight numbers</li>
                <li>• Historical flight data storage</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Notifications
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Discord bot integration</li>
                <li>• Telegram bot notifications</li>
                <li>• Customizable message formatting</li>
                <li>• Error handling and retry logic</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Data Management
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• JSON configuration file management</li>
                <li>• Flight data persistence</li>
                <li>• Log file rotation and cleanup</li>
                <li>• Configuration hot-reloading</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Reliability
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Error handling and recovery</li>
                <li>• Network timeout management</li>
                <li>• Automatic retry mechanisms</li>
                <li>• Health monitoring and alerts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Technical Implementation
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Core Components
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • <strong>Flight API Client:</strong> Handles communication
                  with flight tracking services
                </li>
                <li>
                  • <strong>Notification Manager:</strong> Manages Discord and
                  Telegram bot interactions
                </li>
                <li>
                  • <strong>Data Processor:</strong> Parses and validates flight
                  data
                </li>
                <li>
                  • <strong>Scheduler:</strong> Manages cron job execution and
                  timing
                </li>
                <li>
                  • <strong>Configuration Manager:</strong> Handles settings and
                  flight list management
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Deployment Process
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• AWS Lightsail VM setup and configuration</li>
                <li>• Python environment setup with required dependencies</li>
                <li>• Bot token configuration for Discord and Telegram</li>
                <li>• Cron job setup for automated execution</li>
                <li>• Log monitoring and maintenance procedures</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            System Screenshots
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Discord Notification Example
              </h3>
              <p className="text-gray-600 mb-4">
                The system sends formatted messages to Discord channels with
                real-time flight updates, including departure times, delays,
                gate information, and current status.
              </p>
              <div className="bg-gray-100 rounded-lg overflow-hidden max-w-md">
                <img
                  src={Screenshot1}
                  alt="Discord notification message showing flight tracking updates"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlightTracker
