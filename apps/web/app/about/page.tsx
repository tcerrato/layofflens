import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">About</li>
        </ol>
      </nav>

      {/* Page Content */}
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          About LayoffLens
        </h1>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <img
              src="https://layofflens.blob.core.windows.net/layofflens/tony.jpeg"
              alt="Tony Cerrato"
              className="w-64 h-64 rounded-lg object-cover shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Tony Cerrato
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Tony Cerrato is a seasoned technology leader with more than 30 years of experience in software quality, cloud engineering, and automation. His career spans some of the most innovative names in the industry, including Microsoft, Synopsys, Veracode, and TraceLink, where he led global teams delivering reliable, secure, and high-performance software platforms.
              </p>
            </div>
          </div>

          <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              Tony has spent his career driving the modernization of quality engineering practices across complex, cloud-based software platforms. He focuses on integrating AI-driven testing, continuous delivery, and advanced analytics to enhance coverage, accelerate feedback cycles, and raise the overall standard of software reliability. His leadership style emphasizes data-driven decision-making, collaboration, and a culture of innovation and accountability.
            </p>

            <p>
              Throughout his career in high tech, Tony has helped organizations evolve from traditional QA models to fully automated, intelligence-assisted quality engineering frameworks. He has built and led global teams, defined automation strategies for large-scale SaaS environments, and implemented AI-based systems that improve efficiency and insight across development lifecycles—from regulated industries to modern cloud-native platforms.
            </p>

            <p>
              Tony is an AWS Certified Solutions Architect, AWS Certified AI Practitioner, AWS Certified Cloud Practitioner, and Certified ScrumMaster. He holds a Master's in Computer Information Systems (Security) from Boston University and a Bachelor's in Business Management (MIS) from the University of Massachusetts.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Technology Stack
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            LayoffLens is built with modern cloud technologies and hosted entirely on Microsoft Azure:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Next.js 15</strong> - React framework for the web application</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Azure Static Web Apps</strong> - Hosting with built-in CDN and SSL</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Azure Functions</strong> - Serverless API endpoints and scheduled jobs</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Azure Table Storage</strong> - NoSQL database for feed items</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Azure Blob Storage</strong> - Image and asset hosting</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>GitHub Actions</strong> - CI/CD pipeline for automated deployments</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
