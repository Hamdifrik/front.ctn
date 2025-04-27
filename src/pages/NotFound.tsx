import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Ship className="h-16 w-16 text-primary-500" />
        </div>
        <h1 className="text-5xl font-bold text-neutral-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Page Not Found</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          We can't seem to find the page you're looking for. It might have been moved, renamed, or doesn't exist.
        </p>
        <Button
          as={Link}
          to="/"
          leftIcon={<Home className="h-4 w-4" />}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;