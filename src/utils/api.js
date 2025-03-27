import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const token = cookies.get('userToken');

const api = axios.create({
  baseURL: 'https://backend-gem-music-4069.fly.dev',
  headers: {
    Authorization: token ? `Bearer ${token} ` : '',
  }
});

export default api;
