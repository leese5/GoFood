// userService.js
import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api/user';

export const getUserProfile = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
