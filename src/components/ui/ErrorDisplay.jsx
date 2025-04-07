import { AlertCircle, Music, Disc3, Headphones } from 'lucide-react';
import Link from 'next/link';

const errorMessages = {
  default: {
    title: 'Oops! Something went wrong',
    message: 'We hit a wrong note. Please try again later.',
    icon: AlertCircle
  },
  not_found: {
    title: 'Track Not Found',
    message: 'The song you\'re looking for seems to have skipped away.',
    icon: Music
  },
  artist_not_found: {
    title: 'Artist Not Found',
    message: 'This artist seems to be on a different stage.',
    icon: Headphones
  },
  release_not_found: {
    title: 'Release Not Found',
    message: 'This release seems to be out of stock.',
    icon: Disc3
  },
  network: {
    title: 'Connection Lost',
    message: 'Looks like we lost the signal. Please check your connection.',
    icon: AlertCircle
  },
  server: {
    title: 'Server Error',
    message: 'Our sound system is having issues. Please try again later.',
    icon: AlertCircle
  }
};

export function ErrorDisplay({ 
  errorType = 'default', 
  message = null, 
  showHomeButton = true,
  className = ''
}) {
  const error = errorMessages[errorType] || errorMessages.default;
  const Icon = error.icon;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-6 p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
        <Icon className="h-12 w-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{error.title}</h2>
      <p className="text-gray-300 mb-6 max-w-md">
        {message || error.message}
      </p>
      {showHomeButton && (
        <Link 
          href="/"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      )}
    </div>
  );
}

export function FullPageError({ errorType = 'default', message = null }) {
  return (
    <div className="min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center">
      <ErrorDisplay 
        errorType={errorType} 
        message={message}
        className="bg-black/50 p-12 rounded-xl"
      />
    </div>
  );
}

export default ErrorDisplay; 