import axios from "axios";

const API = import.meta.env.VITE_API_SERVER_URL;

// GET categories
export const getAllCategories = async () => {
  const res = await fetch(`${API}/api/faqCategory`);
  return res.json();
};

// GET faqs
export const getAllFaqs = async () => {
  const res = await fetch(`${API}/api/faqs`);
  return res.json();
};

export const createFaq = (data) => axios.post(`${API}/api/faqs`, data).then(res => res.data)
export const updateFaq = (id, data) => axios.put(`${API}/api/faqs/${id}`, data).then(res => res.data)
export const deleteFaq = (id) => axios.delete(`${API}/api/faqs/${id}`).then(res => res.data)