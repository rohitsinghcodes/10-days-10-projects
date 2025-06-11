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
      </body>
    </html>
  );
}
