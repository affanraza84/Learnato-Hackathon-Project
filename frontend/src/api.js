import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://learnato-hackathon-project-backend.onrender.com/api';

export const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});
