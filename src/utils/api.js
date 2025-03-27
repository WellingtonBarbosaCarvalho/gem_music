import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const token = cookies.get('userToken');
console.log(token);

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    Authorization: token ? `Bearer ${token} ` : '',
  }
});

export default api;
