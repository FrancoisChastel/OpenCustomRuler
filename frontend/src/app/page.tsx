export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          OpenCustomRuler
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
          A full-stack application built with Next.js and Python FastAPI
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Frontend
            </h2>
            <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2">
              <li>✓ Next.js 16</li>
              <li>✓ React 19</li>
              <li>✓ TypeScript</li>
              <li>✓ Tailwind CSS</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Backend
            </h2>
            <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2">
              <li>✓ Python 3.12</li>
              <li>✓ FastAPI</li>
              <li>✓ Uvicorn</li>
              <li>✓ CORS Enabled</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12">
          <a
            href="http://localhost:8000/docs"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View API Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
