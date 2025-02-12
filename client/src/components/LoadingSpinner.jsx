// frontend/src/components/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css'; // We'll create LoadingSpinner.css next

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;