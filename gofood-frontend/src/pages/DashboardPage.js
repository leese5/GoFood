import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFoodTrucks, createFoodTruck, removeFoodTruck, getUser, updateFoodTruck, toggleTruckStatus } from '../services/foodTruckService';
import { isTokenExpired, logout } from '../services/authService';
import CreateForm from '../components/CreateForm';
import UpdateForm from '../components/UpdateForm';
import OpenForm from '../components/OpenForm';
import { jwtDecode } from 'jwt-decode';
import './DashboardPage.css';

function DashboardPage() {
  const [trucks, setTrucks] = useState([]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('User');
  const [error, setError] = useState(null);
  const [editingTruck, setEditingTruck] = useState(null);
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();


  const timeOptions = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"
  ];

  const ensureTokenValidity = () => {
    if (isTokenExpired()) {
      setWarning('Your session has expired. Please log in again.');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 3000); // Show the warning for 3 seconds before redirecting
      throw new Error('Token expired');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.user?.id || decoded.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      const fetchUserTrucks = async () => {
        try {
          ensureTokenValidity();
          const data = await getUserFoodTrucks(userId);
          setTrucks(data);
        } catch (err) {
          console.error('Error fetching user trucks:', err);
          setError('Unable to fetch food trucks. Please try again later.');
        }
      };
      fetchUserTrucks();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          ensureTokenValidity();
          const data = await getUser(userId);
          console.log(data);
          setUserName(data.name);
        } catch (err) {
          console.error('Error fetching user: '. err);
          setError('Unable to fetch user.');
        }
      }
      fetchUser();
    }
  }, [userId]);

  const handleCreateTruck = async (truckData) => {
    try {
      ensureTokenValidity();
      const createdTruck = await createFoodTruck(truckData);
      setTrucks((prev) => [...prev, createdTruck]);
    } catch (error) {
      console.error('Error creating truck:', error);
    }
  };

  const handleDeleteTruck = async (truckId) => {
    try {
      ensureTokenValidity();
      await removeFoodTruck(truckId);
      setTrucks((prev) => prev.filter((truck) => truck._id !== truckId));
    } catch (error) {
      console.error('Error deleting truck:', error);
    }
  };

  const handleUpdateTruck = async(updatedTruck) => {
    try {
      ensureTokenValidity();
      const data = await updateFoodTruck(updatedTruck._id, updatedTruck);
      setTrucks((prev) => prev.map((truck) => (truck._id === data._id ? data:truck)));
      setEditingTruck(null);
    } catch (error) {
      console.error('Error updating truck', error)
    }
  };

  const handleToggleStatus = async (truckId, newStatus) => {
    try {
      ensureTokenValidity();
      const updatedTruck = await updateFoodTruck(truckId, { public: newStatus }); // Pass the boolean value directly
      setTrucks((prev) =>
        prev.map((truck) => (truck._id === truckId ? { ...truck, public: newStatus } : truck))
      );
    } catch (error) {
      console.error('Error toggling public status:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {warning && <p className="warning-message">{warning}</p>}
      <h1 className='dashoboard-header'>{userName}'s Dashboard</h1>
      <CreateForm onSubmit={handleCreateTruck} timeOptions={timeOptions} />
      <div className="truck-list">
        {trucks.map((truck) => (
          <div className="truck-card" key={truck._id}>
            <h3>{truck.name}</h3>
            <p>{truck.description}</p>
            <p><strong>Cuisine:</strong> {truck.cuisine}</p>
            <p><strong>Operating Hours:</strong> {truck.operatingHours}</p>
            <button onClick={() => handleDeleteTruck(truck._id)} className="delete-button">
              Delete
            </button>
            <button onClick={() => setEditingTruck(truck)} className="update-button">
              Update
            </button>
            <OpenForm
              truckId={truck._id}
              isPublic={truck.public}
              onToggleStatus={handleToggleStatus}
            />
            {editingTruck && editingTruck._id === truck._id && (
              <UpdateForm
                truck={editingTruck}
                onUpdate={handleUpdateTruck}
                timeOptions={timeOptions}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
