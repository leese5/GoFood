import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api/foodtrucks';
const API_URL_USER = 'http://localhost:5000/api/users';

export const getAllFoodTrucks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUserFoodTrucks = async (userId) => {
  try {
    const response = await axios.get(`${API_URL_USER}/${userId}/foodtrucks`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user trucks:', error.response?.data || error.message);
    throw error;
  }
};

export const toggleTruckStatus = async (truckId, newStatus) => {
  const token = getToken();
  const response = await axios.patch(
    `${API_URL}/${truckId}/public`,
    { public: newStatus }, // Send the new status
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateFoodTruck = async (truckId, updatedData) => {
  const token = getToken();
  const response = await axios.put(
    `${API_URL}/${truckId}`,
    updatedData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};


export const getUser = async(userId) => {
  try {
    const response = await axios.get(`${API_URL_USER}/${userId}`, {
      headers: {Accept: 'application/json'},
    });
    return response.data
  } catch (error) {
    console.error('Error fetching user: ', error.response?.data || error.message);
    throw error;
  }
};

// export const getUserFoodTrucks = async () => {
//   const token = getToken();
//   try {
//     const response = await axios.get(`${API_URL}/my-trucks`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user trucks:", error.response?.data || error.message);
//     throw error; // Rethrow error to handle in the component
//   }
// };

export const createFoodTruck = async (data) => {
  const token = getToken();
  const response = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const removeFoodTruck = async (truckId) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/${truckId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
