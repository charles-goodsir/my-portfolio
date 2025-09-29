import Screenshot1 from '../../assets/finance-tracker/screenshot1.png'
import Screenshot2 from '../../assets/finance-tracker/screenshot2.png'
import Screenshot3 from '../../assets/finance-tracker/screenshot3.png'
import Screenshot4 from '../../assets/finance-tracker/screenshot4.png'
import Screenshot5 from '../../assets/finance-tracker/screenshot5.png'
interface FinanceTrackerProps {
  setActiveSection: (section: string) => void
}

function FinanceTracker({ setActiveSection }: FinanceTrackerProps) {
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
            Finance Tracker 2.0
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            A comprehensive personal finance management application that
            combines modern web technologies with cloud infrastructure to
            provide automated transaction tracking, smart categorization, and
            intelligent insights.
          </p>
          <p className="text-xl text-gray-600 mb-6">
            Built with FastAPI backend, AWS serverless architecture, and a
            beautiful responsive frontend. Features automated transaction
            processing, smart categorization, and real-time notifications via
            Telegram.
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              'Python',
              'FastAPI',
              'AWS Lambda',
              'DynamoDB',
              'API Gateway',
              'CloudWatch',
              'JavaScript',
              'Progressive Web App',
              'Telegram Bot API',
              'AWS SAM',
              'Serverless',
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
              href="https://github.com/charles-goodsir/finance-tracker"
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
              Finance Tracker 2.0 is a production-ready personal finance
              management application that demonstrates full-stack development
              skills with modern cloud technologies. The application provides
              automated transaction tracking, smart categorization, and
              intelligent insights to help users manage their finances
              effectively.
            </p>
            <p className="text-gray-700 mb-4">
              The backend is built with FastAPI and deployed on AWS Lambda for
              serverless scalability, while the frontend uses vanilla JavaScript
              with a responsive design that works as a Progressive Web App. The
              system integrates with DynamoDB for flexible data storage and
              includes Telegram bot integration for real-time notifications.
            </p>
            <p className="text-gray-700 mb-4">
              Key features include automated recurring transaction processing,
              smart CSV import/export capabilities, intelligent transaction
              categorization, and a beautiful dashboard interface. The
              application supports both local development (SQLite) and
              production deployment (DynamoDB) with comprehensive error handling
              and logging.
            </p>
            <p className="text-gray-700">
              This project showcases expertise in cloud architecture, serverless
              development, API design, database management, and modern web
              technologies while solving real-world financial management
              challenges.
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
                Backend Infrastructure
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• FastAPI framework for high-performance APIs</li>
                <li>• AWS Lambda for serverless compute</li>
                <li>• DynamoDB for NoSQL data storage</li>
                <li>• API Gateway for RESTful endpoints</li>
                <li>• CloudWatch Events for automated scheduling</li>
                <li>• AWS SAM for Infrastructure as Code</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Frontend Technology
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Vanilla JavaScript with modern ES6+</li>
                <li>• Responsive CSS with mobile-first design</li>
                <li>• Progressive Web App capabilities</li>
                <li>• Real-time data updates and form handling</li>
                <li>• Beautiful, intuitive user interface</li>
                <li>• Cross-platform compatibility</li>
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
                Transaction Management
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Add, view, and categorize transactions</li>
                <li>• Smart pre-defined categories</li>
                <li>• Intelligent default categorization</li>
                <li>• Bulk CSV import/export</li>
                <li>• Transaction history and search</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Automation & Integration
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Automated recurring transactions</li>
                <li>• Telegram bot notifications</li>
                <li>• CloudWatch Events scheduling</li>
                <li>• Real-time data synchronization</li>
                <li>• Multi-environment support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                User Experience
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Responsive dashboard design</li>
                <li>• Progressive Web App functionality</li>
                <li>• Intuitive form handling</li>
                <li>• Real-time feedback and updates</li>
                <li>• Mobile-optimized interface</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Security & Reliability
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Comprehensive error handling</li>
                <li>• CORS configuration</li>
                <li>• Data validation and sanitization</li>
                <li>• CloudWatch logging</li>
                <li>• Automated backup and recovery</li>
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
                Backend Components
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • <strong>FastAPI Application:</strong> High-performance REST
                  API with automatic documentation
                </li>
                <li>
                  • <strong>DynamoDB Models:</strong> Flexible NoSQL data models
                  for transactions and categories
                </li>
                <li>
                  • <strong>Lambda Handlers:</strong> Serverless function
                  handlers for API endpoints
                </li>
                <li>
                  • <strong>Telegram Integration:</strong> Bot API for real-time
                  notifications
                </li>
                <li>
                  • <strong>CloudWatch Events:</strong> Automated scheduling for
                  recurring transactions
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Frontend Architecture
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • <strong>Modular JavaScript:</strong> Clean, maintainable
                  code structure
                </li>
                <li>
                  • <strong>Responsive Design:</strong> Mobile-first CSS with
                  Tailwind-like utilities
                </li>
                <li>
                  • <strong>Progressive Web App:</strong> Installable with
                  offline capabilities
                </li>
                <li>
                  • <strong>Real-time Updates:</strong> Dynamic data loading and
                  form handling
                </li>
                <li>
                  • <strong>Error Handling:</strong> User-friendly error
                  messages and feedback
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                DevOps & Deployment
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• AWS SAM for Infrastructure as Code</li>
                <li>• Automated deployment pipeline</li>
                <li>• Environment management (local/production)</li>
                <li>• CloudWatch monitoring and logging</li>
                <li>• Version control with Git</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Future Enhancements */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Future Enhancements (Roadmap)
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Phase 4: Smart Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Machine Learning categorization</li>
                <li>• JWT Authentication</li>
                <li>• Advanced analytics</li>
                <li>• Budget tracking</li>
                <li>• Predictive insights</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Phase 5: Mobile & PWA
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Enhanced PWA features</li>
                <li>• Offline support</li>
                <li>• Push notifications</li>
                <li>• Camera integration (OCR)</li>
                <li>• Native app experience</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Phase 6: Collaboration
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Multi-user accounts</li>
                <li>• Family budgeting</li>
                <li>• Shared financial goals</li>
                <li>• Expense splitting</li>
                <li>• Investment tracking</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Application Screenshots
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Dashboard Overview
              </h3>
              <p className="text-gray-600 mb-4">
                The main dashboard provides a comprehensive view of financial
                data with intuitive navigation and real-time updates.
              </p>
              <div className="bg-gray-100 rounded-lg overflow-hidden max-w-2xl">
                <img
                  src={Screenshot1}
                  alt="Finance Tracker dashboard showing transaction overview and navigation"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Transaction Management
              </h3>
              <p className="text-gray-600 mb-4">
                Add and manage transactions with smart categorization and bulk
                import capabilities.
              </p>
              <div className="bg-gray-100 rounded-lg overflow-hidden max-w-2xl">
                <img
                  src={Screenshot2}
                  alt="Transaction management interface with form inputs and categorization"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden max-w-2xl">
                <img
                  src={Screenshot3}
                  alt="Category management interface showing predefined and custom categories"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Data Import/Export
              </h3>
              <p className="text-gray-600 mb-4">
                Bulk data management with CSV import/export functionality for
                seamless data migration.
              </p>
              <div className="bg-gray-100 rounded-lg overflow-hidden max-w-2xl">
                <img
                  src={Screenshot4}
                  alt="CSV import/export interface for bulk data management"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Category Management{' '}
              </h3>
              <p className="text-gray-600 mb-4">
                Organize transactions with custom categories and smart defaults
                for better financial tracking.{' '}
              </p>
              <div className="bg-gray-100 rounded-lg overflow-hidden max-w-2xl">
                <img
                  src={Screenshot5}
                  alt="Settings and configuration panel with various options"
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

export default FinanceTracker
