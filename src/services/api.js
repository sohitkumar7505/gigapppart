// services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://gigbackpart.onrender.com'; // Replace with your actual backend URL

export const sendEmergencySMS = async (number, latitude, longitude, message = '') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/emergency`, {
      number,
      latitude,
      longitude,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error sending emergency SMS:', error);
    throw error;
  }
};

export const fetchSafetyStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/safety-status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching safety status:', error);
    throw error;
  }
};
export const addEarning = (amount, platform) => {
  return axios.post(`${API_BASE_URL}/earning`, { amount, platform });
};

export const getEarningsByDate = (date) => {
  return axios.get(`${API_BASE_URL}/earning`, { params: { date } });
};

export const addExpense = (amount, type) => {
  return axios.post(`${API_BASE_URL}/expense`, { amount, type });
};

export const getExpensesByDate = (date) => {
  return axios.get(`${API_BASE_URL}/expense`, { params: { date } });
};

export const generateReport = (date, target = 0) => {
  return axios.post(`${API_BASE_URL}/report/generate`, { date, target });
};