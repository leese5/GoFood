import React, { useState, useEffect } from 'react';
import './UpdateForm.css';

function UpdateForm({ truck, onUpdate, timeOptions }) {
  const [formData, setFormData] = useState({
    ...truck,
    location: { ...truck.location },
  });
  const [menuItem, setMenuItem] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  useEffect(() => {
    // Split the operatingHours into openingTime and closingTime if it exists
    if (truck.operatingHours) {
      const [opening, closing] = truck.operatingHours.split(' - ');
      setOpeningTime(opening || '');
      setClosingTime(closing || '');
    }
  }, [truck]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMenuItem = () => {
    if (menuItem) {
      setFormData((prev) => ({
        ...prev,
        menu: [...prev.menu, menuItem],
      }));
      setMenuItem('');
    }
  };

  const handleMenuChange = (e) => {
    const menuItems = e.target.value.split(',').map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      menu: menuItems,
    }));
  };

  const handleDeleteMenuItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      operatingHours: `${openingTime} - ${closingTime}`, // Combine the opening and closing times
    };
    onUpdate(updatedData);
  };

  return (
    <div className="update-form">
      <h3>Update Food Truck</h3>
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
              <li key={index} className="menu-item">
                {item}{' '}
                <button
                  type="button"
                  className="delete-menu-button"
                  onClick={() => handleDeleteMenuItem(index)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="update-submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UpdateForm;
