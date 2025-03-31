import { Music } from 'lucide-react';

export function LoadingSpinner({ size = 'default', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizes = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <div className={`${sizeClasses[size]} relative animate-spin`}>
        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-75 blur-sm"></div>
        <div className="absolute inset-0.5 rounded-full bg-gradient-primary"></div>
        <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
          <Music className="text-white h-1/2 w-1/2" />
        </div>
      </div>
      {text && <p className={`${textSizes[size]} text-white`}>{text}</p>}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black/80 backdrop-blur-md">
      <div className="text-center">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}

export default LoadingSpinner; 