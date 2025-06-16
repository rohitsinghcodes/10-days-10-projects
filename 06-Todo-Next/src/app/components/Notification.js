import { useEffect } from 'react';

export default function Notification({ message, clear }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => clear(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-bounce">
      {message}
    </div>
  );
}
