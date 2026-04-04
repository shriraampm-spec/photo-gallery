import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://3.24.168.16:5001',
});

export default axiosInstance;
