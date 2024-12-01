import React from 'react';
import './OpenForm.css';

function OpenForm({ truckId, isPublic, onToggleStatus }) {
  const handleToggle = () => {
    onToggleStatus(truckId, !isPublic); // Call the `onToggleStatus` function with the new status
  };

  return (
    <div className="update-form">
      <button 
        className={`toggle-button ${isPublic ? 'close' : 'open'}`} 
        onClick={handleToggle}
      >
        {isPublic ? 'Close Truck' : 'Open Truck'}
      </button>
    </div>
  );
}

export default OpenForm;
