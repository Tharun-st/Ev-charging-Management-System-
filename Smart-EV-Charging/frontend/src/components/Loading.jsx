import React from 'react';

const Loading = ({ message = 'Loading EV data...' }) => {
  return (
    <div className="loading-container">
      <div className="charging-pulse-loader">
        <div className="pulse-ring"></div>
        <div className="pulse-dot"></div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;
