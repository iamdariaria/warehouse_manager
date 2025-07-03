import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/warehouse-dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
            <Icon 
              name="AlertTriangle" 
              size={48} 
              color="var(--color-primary)" 
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4 font-heading">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4 font-heading">
            Page Not Found
          </h2>
          <p className="text-text-secondary font-body">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-secondary-100 text-text-primary px-6 py-3 rounded-lg font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 font-body"
          >
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-text-muted font-body">
            Need help? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;