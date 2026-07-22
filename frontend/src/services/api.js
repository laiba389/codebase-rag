import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const uploadRepository = (formData) =>
  axios.post(`${API}/upload`, formData);

export const indexRepository = () =>
  axios.post(`${API}/index`);

export const askQuestion = (query) =>
  axios.post(`${API}/ask`, { query });

export const explainFileAPI = (filename) =>
  axios.post(`${API}/explain-file`, { filename });