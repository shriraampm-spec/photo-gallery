import axios from 'axios';

const hostname = window.location.hostname;
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || `http://${hostname}:5001`,
});

export default axiosInstance;
