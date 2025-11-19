import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  console.log(res.data);
  return res.data; // should return { user, token }
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  return res.data;
};
