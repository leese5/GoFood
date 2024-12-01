import React, { useState, useEffect } from 'react';
import './CreateForm.css';

function CreateForm({ onSubmit, timeOptions }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    location: { lat: null, lng: null },
    menu: [],
    operatingHours: ''
  });

  const [menuItem, setMenuItem] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    // Fetch the user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prevData) => ({
          ...prevData,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
      },
      (error) => {
        console.error('Error fetching location:', error);
        setLocationError('Unable to fetch current location.');
      }
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMenuItem = () => {
    if (menuItem) {
      setFormData((prev) => ({
        ...prev,
        menu: [...prev.menu, menuItem]
      }));
      setMenuItem('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location.lat || !formData.location.lng) {
      setLocationError('Location is required to add a truck.');
      return;
    }
    if (openingTime && closingTime) {
      onSubmit({
        ...formData,
        operatingHours: `${openingTime} - ${closingTime}`
      });
      setFormData({
        name: '',
        description: '',
        cuisine: '',
        location: { lat: null, lng: null },
        menu: [],
        operatingHours: ''
      });
      setOpeningTime('');
      setClosingTime('');
      setMenuItem('');
      setLocationError('');
    } else {
      setLocationError('Please select both opening and closing times.');
    }
  };

  return (
    <div className="create-form">
      <h3>Create Food Truck</h3>
      {locationError && <p className="error-message">{locationError}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Truck name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine"
          value={formData.cuisine}
          onChange={handleInputChange}
        />

        <div className="time-selector">
          <label>Opening Time</label>
          <select value={openingTime} onChange={(e) => setOpeningTime(e.target.value)}>
            <option value="">Select Opening Time</option>
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>

          <label>Closing Time</label>
          <select value={closingTime} onChange={(e) => setClosingTime(e.target.value)}>
            <option value="">Select Closing Time</option>
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="menu-input">
          <input
            type="text"
            placeholder="Add menu item"
            value={menuItem}
            onChange={(e) => setMenuItem(e.target.value)}
          />
          <button type="button" onClick={handleAddMenuItem}>
            Add Menu Item
          </button>
          <ul>
            {formData.menu.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <button type="submit" className="add-truck-button">
          Add Food Truck
        </button>
      </form>
    </div>
  );
}

export default CreateForm;
