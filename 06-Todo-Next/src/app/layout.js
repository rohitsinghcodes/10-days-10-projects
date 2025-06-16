// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Daily Task List | Developed by Rohit Singh',
  description: 'A modern, clean, and efficient Todo List application with filtering, editing, and localStorage features.',
  keywords: ['Todo App', 'Next.js Todo', 'React Todo List', 'Task Manager', 'daily task list', 'Rohit Singh', 'rohitsinghcodes', 'Rohit Singh Rajput'],
  authors: [{ name: 'Rohit Singh', url: 'https://rohitsinghcodes-portfolio.onrender.com/' }],
  creator: 'Rohit Singh',
  icons: {
    icon: '/favicon.jpg', // ✅ JPG format favicon
  },
  openGraph: {
    title: 'Todo List App | Rohit Singh',
    description: 'Organize your tasks with this stylish and fully functional Todo List built using Next.js 15 and Tailwind CSS.',
    url: 'https://todo-list-daily-task.onrender.com/',
    siteName: 'Todo List App',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Todo List Screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-100 text-gray-800">
        <main className="min-h-screen p-4 max-w-2xl mx-auto">{children}</main>
        {/* Footer */}
        <footer className="fixed bottom-4 right-4 bg-white shadow-md rounded-xl p-3 text-sm flex flex-col items-center gap-3 z-50">
          <p>
            Made by{' '}
            <a
              href="https://rohitsinghcodes-portfolio.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              Rohit Singh
            </a>
          </p>
          <div className="flex gap-2">
            <a href="https://linkedin.com/in/rohitsinghcodes" target="_blank" aria-label="LinkedIn">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
            </a>
            <a href="https://github.com/rohitsinghcodes" target="_blank" aria-label="GitHub">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" className="w-5 h-5" />
            </a>
            <a href="https://x.com/rohitsinghcodes" target="_blank" aria-label="X">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg" alt="X" className="w-5 h-5" />
            </a>
            <a href="https://facebook.com/rohitsinghcodes" target="_blank" aria-label="Facebook">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/rohitsinghcodes" target="_blank" aria-label="Instagram">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
