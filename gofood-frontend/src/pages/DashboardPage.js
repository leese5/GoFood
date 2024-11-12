import React, { useEffect, useState } from 'react';
import { getAllFoodTrucks, getUserFoodTrucks, createFoodTruck, removeFoodTruck } from '../services/foodTruckService';
import './DashboardPage.css';

function DashboardPage() {
  const [trucks, setTrucks] = useState([]);
  const [newTruck, setNewTruck] = useState({
    name: '',
    description: '',
    cuisine: '',
    location: { lat: null, lng: null },
    menu: [],
    operatingHours: ''
  });
  const [locationError, setLocationError] = useState('');
  const [menuItem, setMenuItem] = useState('');

  const timeOptions = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"
  ];

  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  useEffect(() => {
    const fetchUserTrucks = async () => {
      try {
        const data = await getUserFoodTrucks();
        setTrucks(data);
      } catch (error) {
        console.error('Error fetching user trucks:', error);
      }
    };
    fetchUserTrucks();

    // const fetchTrucks = async () => {
    //   const data = await getAllFoodTrucks();
    //   setTrucks(data);
    // };
    // fetchTrucks();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewTruck((prevTruck) => ({
          ...prevTruck,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
      },
      (error) => {
        console.error('Error fetching location:', error);
        setLocationError('Unable to fetch current location.');
      }
    );
  }, []);

  const handleAddMenuItem = () => {
    if (menuItem) {
      setNewTruck((prevTruck) => ({
        ...prevTruck,
        menu: [...prevTruck.menu, menuItem]
      }));
      setMenuItem('');
    }
  };

  const handleCreateTruck = async () => {
    if (!newTruck.location.lat || !newTruck.location.lng) {
      setLocationError('Location is required to add a truck.');
      return;
    }

    if (openingTime && closingTime) {
      newTruck.operatingHours = `${openingTime} - ${closingTime}`;
    } else {
      setLocationError('Please select both opening and closing times.');
      return;
    }

    try {
      const createdTruck = await createFoodTruck(newTruck);
      setTrucks([...trucks, createdTruck]);
      setNewTruck({
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
    } catch (error) {
      console.error('Error creating truck:', error);
    }
  };

  const handleDeleteTruck = async (truckId) => {
    try {
      await removeFoodTruck(truckId);
      setTrucks(trucks.filter((truck) => truck._id !== truckId));
    } catch (error) {
      console.error('Error deleting truck:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {locationError && <p className="error-message">{locationError}</p>}

      <div className="form-container">
        <input
          type="text"
          placeholder="Truck name"
          value={newTruck.name}
          onChange={(e) => setNewTruck({ ...newTruck, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTruck.description}
          onChange={(e) => setNewTruck({ ...newTruck, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cuisine"
          value={newTruck.cuisine}
          onChange={(e) => setNewTruck({ ...newTruck, cuisine: e.target.value })}
        />

        <div className="time-selector">
          <label>Opening Time</label>
          <select value={openingTime} onChange={(e) => setOpeningTime(e.target.value)}>
            <option value="">Select Opening Time</option>
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>

          <label>Closing Time</label>
          <select value={closingTime} onChange={(e) => setClosingTime(e.target.value)}>
            <option value="">Select Closing Time</option>
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>{time}</option>
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
          <button type="button" onClick={handleAddMenuItem}>Add Menu Item</button>
          <ul>
            {newTruck.menu.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <button onClick={handleCreateTruck} className="add-truck-button">Add Food Truck</button>
      </div>

      <div className="truck-list">
        {trucks.length ? (
          trucks.map((truck) => (
            <div className="truck-card" key={truck._id}>
              <h3>{truck.name}</h3>
              <p>{truck.description}</p>
              <p><strong>Cuisine:</strong> {truck.cuisine}</p>
              <p><strong>Operating Hours:</strong> {truck.operatingHours}</p>
              <button onClick={() => handleDeleteTruck(truck._id)} className="delete-button">Delete</button>
            </div>
          ))
        ) : (
          <p className="no-trucks-message">No food trucks available. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
