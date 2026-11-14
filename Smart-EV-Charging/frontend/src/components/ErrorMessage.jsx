import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="error-banner">
      <div className="error-icon">
        <AlertCircle size={20} />
      </div>
      <div className="error-content">
        <div className="error-title">Notice</div>
        <p className="error-text">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-retry" title="Retry request">
          <RefreshCw size={15} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
