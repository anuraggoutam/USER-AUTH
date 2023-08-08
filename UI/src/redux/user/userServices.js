import axios from 'axios';
import { BASE_URL } from '../../requestMethods';
const login = async (userData) => {
  const response = await axios.post(`${BASE_URL}auth/login`, userData);
  localStorage.setItem('auth', JSON.stringify(response.data.accessToken));
  return response.data;
};
const logout = () => {
  localStorage.removeItem('persist:root');
  localStorage.removeItem('auth');
};

const authService = {
  login,
  logout,
};

export default authService;
