// frontend/src/api/strapi.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1338';

const strapiApi = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default strapiApi;