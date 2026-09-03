import Accounts_1 from '../../assets/finance-tracker/finance-accounts_1.webp'
import Accounts_2 from '../../assets/finance-tracker/finance-accounts_2.webp'
import CSV_Import from '../../assets/finance-tracker/finance-csv_import.webp'
import Goals from '../../assets/finance-tracker/finance-goals.webp'
import Main_Screen from '../../assets/finance-tracker/finance-main_screen.webp'
import Smart_Insights from '../../assets/finance-tracker/finance-smart_insights.webp'
import Transactions from '../../assets/finance-tracker/finance-transactions.webp'
import { Link } from 'react-router'
import ScreenshotFigure from '../ui/ScreenshotFigure'

function FinanceTracker() {
  return (
    <section className="bg-page py-16 px-4">
      <div className="max-w-[45rem] mx-auto">
        {/* Back Button */}
        <Link
          to="/projects"
          className="mb-8 flex items-center text-primary hover:underline underline-offset-2 transition-colors duration-300"
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
        </Link>

        {/* Project Header */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h1 className="text-4xl font-bold text-ink mb-4">
            Finance Tracker 2.0
          </h1>
          <p className="text-xl text-ink-muted mb-6">
            A desktop finance tracker for macOS that imports bank CSVs,
            auto‑classifies transactions, lets you review/commit them, manage
            account balances and monthly snapshots, view a dashboard with
            insights/health, and receive Telegram reminders/notifications.
          </p>
          <p className="text-xl text-ink-muted mb-6">
            It uses a local SQLite cache for a fast, offline‑friendly UI and an
            AWS backend for persistent data, insights, and learning.
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              'Python',
              'PyQt6',
              'SQLite (local cache)',
              'Requests (HTTP)',
              'FastAPI (Lambda)',
              'AWS Lambda',
              'API Gateway',
              'AWS SAM (template.yaml)',
              'DynamoDB',
              'EventBridge (cron)',
              'CloudWatch',
              'Google Gemini (classification fallback)',
              'Telegram Bot API',
              'python-dotenv',
              'PyInstaller (packaging)',
            ].map((tech) => (
              <span
                key={tech}
                className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold"
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
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              View Code
            </a>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              Finance Tracker 2.0 is a native desktop app built with PyQt6 for
              macOS. A local SQLite cache powers fast reads and offline usage,
              while an AWS backend provides durable storage, insights, and a
              learning system that improves from user feedback.
            </p>
            <p className="text-ink-muted mb-4">
              The backend uses FastAPI on Lambda behind API Gateway and is
              managed with AWS SAM (template.yaml). DynamoDB stores
              transactions, monthly snapshots, learning patterns, and stats.
              EventBridge drives a monthly Telegram reminder. Hybrid
              classification combines rules with a Google Gemini fallback and
              persists user corrections for continuous improvement.
            </p>
            <p className="text-ink-muted mb-4">
              Key features include CSV import with interactive review, smart
              auto‑classification, account balances and monthly snapshots, a
              dashboard with insights and health indicators, and Telegram
              reminders/commit summaries.
            </p>
            <p className="text-ink-muted">
              This project demonstrates Python desktop (PyQt6), data modeling
              with SQLite and DynamoDB, serverless architecture, hybrid
              ML‑assisted classification, and integrations like Telegram and
              dotenv‑based configuration.
            </p>
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            System Architecture
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Desktop Application (macOS)
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• PyQt6 UI with Qt Widgets</li>
                <li>• Local data storage with SQLite</li>
                <li>• Background threads for long-running tasks</li>
                <li>• Native menus, dialogs, and keyboard shortcuts</li>
                <li>• Packaged for macOS via PyInstaller</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Backend (AWS)
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• FastAPI on Lambda behind API Gateway</li>
                <li>• AWS SAM (template.yaml) for IaC and deployments</li>
                <li>• DynamoDB: transactions, snapshots, patterns, stats</li>
                <li>• EventBridge cron: monthly Telegram reminder</li>
                <li>• CloudWatch: logs and metrics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Transaction Management
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Add, view, and categorize transactions</li>
                <li>• Smart pre-defined categories</li>
                <li>• Intelligent default categorization</li>
                <li>• Bulk CSV import/export</li>
                <li>• Transaction history and search</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Automation & Integration
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• CSV import with interactive review & commit</li>
                <li>• Auto‑classification (rules + Gemini fallback)</li>
                <li>• Telegram reminders and commit summaries</li>
                <li>• Optional cloud sync via FastAPI</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Desktop Experience
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Native macOS UI with PyQt6</li>
                <li>
                  • Tabs: Dashboard, Transactions, CSV Import, Accounts, Goals,
                  Insights
                </li>
                <li>
                  • Credit Card widget: utilization, activity, payment history
                </li>
                <li>
                  • Quick insights, recent transactions, health indicators
                </li>
                <li>• CSV import/export workflows</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Security & Reliability
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Comprehensive error handling</li>
                <li>
                  • Data model conventions (exclude transfers/payments/ATM from
                  spend)
                </li>
                <li>• Data validation and sanitization</li>
                <li>• Application logs and diagnostics</li>
                <li>• Backup/restore of local database</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            Technical Implementation
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Backend Components (AWS)
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>
                  • <strong>FastAPI on Lambda:</strong> REST API with Pydantic
                  models and serialization
                </li>
                <li>
                  • <strong>DynamoDB Tables:</strong> Transactions, snapshots,
                  learning patterns, aggregate stats
                </li>
                <li>
                  • <strong>EventBridge (cron):</strong> Monthly Telegram
                  reminder trigger
                </li>
                <li>
                  • <strong>Hybrid Classifier:</strong> Rules engine with Gemini
                  fallback and confidence scoring
                </li>
                <li>
                  • <strong>Learning System:</strong> Stores corrections and
                  applies patterns over time
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Desktop Architecture (PyQt6)
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>
                  • <strong>PyQt6 Widgets:</strong> Tabs for Dashboard,
                  Transactions, CSV Import, Accounts, Goals, Insights
                </li>
                <li>
                  • <strong>Model-View Patterns:</strong> Clean state/data flow
                </li>
                <li>
                  • <strong>SQLite Cache:</strong> Fast reads and offline
                  support with migrations
                </li>
                <li>
                  • <strong>Background Workers:</strong> Threads for long tasks
                </li>
                <li>
                  • <strong>Requests & Dotenv:</strong> HTTP to AWS API;
                  configuration via .env
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                DevOps & Deployment
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• AWS SAM for IaC (template.yaml)</li>
                <li>• PyInstaller packaging for macOS</li>
                <li>• Optional code signing/notarization</li>
                <li>• Environment configs via python-dotenv</li>
                <li>• CloudWatch monitoring for backend</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Future Enhancements */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            Future Enhancements (Roadmap)
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Phase 4: Smart Features
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Machine Learning categorization</li>
                <li>• JWT Authentication</li>
                <li>• Advanced analytics</li>
                <li>• Budget tracking</li>
                <li>• Predictive insights</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Phase 5: Desktop Enhancements
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Auto-updates for macOS builds</li>
                <li>• System tray and background sync</li>
                <li>• Native notifications</li>
                <li>• Receipt scanning (OCR)</li>
                <li>• Accessibility improvements</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Phase 6: Collaboration
              </h3>
              <ul className="space-y-2 text-ink-muted">
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
        <div className="bg-card border border-line rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            Application Screenshots
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-4">
                Dashboard Overview
              </h3>
              <p className="text-ink-muted mb-4">
                The main dashboard provides a comprehensive view of financial
                data with intuitive navigation and real-time updates.
              </p>
              <div className="bg-sunken rounded-lg overflow-hidden max-w-2xl">
                <ScreenshotFigure src={Main_Screen} alt="Finance Tracker dashboard showing transaction overview and navigation" width={1400} height={924} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ink mb-4">
                Transaction Management
              </h3>
              <p className="text-ink-muted mb-4">
                Add and manage transactions with smart categorization and bulk
                import capabilities.
              </p>
              <div className="bg-sunken rounded-lg overflow-hidden max-w-2xl">
                <ScreenshotFigure src={Transactions} alt="Transaction management interface with form inputs and categorization" width={1400} height={956} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ink mb-4">
                Accounts Management
              </h3>
              <p className="text-ink-muted mb-4">
                Manage your accounts with the accounts feature.
              </p>
              <div className="bg-sunken rounded-lg overflow-hidden max-w-2xl">
                <ScreenshotFigure src={Accounts_1} alt="Accounts Management Interface allowing adding and editing account balances" width={1400} height={942} />
              </div>
              <div className="bg-sunken rounded-lg overflow-hidden max-w-2xl">
                <ScreenshotFigure src={Accounts_2} alt="Second Accounts Screenshot" width={1400} height={949} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ink mb-4">
                Data Import/Export
              </h3>
              <p className="text-ink-muted mb-4">
                Bulk data management with CSV import/export functionality for
                smooth data migration.
              </p>
              <div className="bg-sunken rounded-lg overflow-hidden max-w-2xl">
                <ScreenshotFigure src={CSV_Import} alt="CSV import/export interface for bulk data management" width={1400} height={943} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ink mb-4">
                Goals Management
              </h3>
              <p className="text-ink-muted mb-4">
                Set and manage your financial goals with the goals feature.
              </p>
            </div>
            <div className="bg-sunken rounded-lg overflow-hidden max-w-2xl">
              <ScreenshotFigure src={Goals} alt="Goals management interface showing you your financial goals" width={1400} height={942} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ink mb-4">
                Smart Insights{' '}
              </h3>
              <p className="text-ink-muted mb-4">
                Get quick insights into your financial health with the smart
                insights feature.
              </p>
              <div className="bg-sunken rounded-lg overflow-hidden max-w-2xl">
                <ScreenshotFigure src={Smart_Insights} alt="Smart insights showing you your financial health" width={1400} height={930} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinanceTracker
