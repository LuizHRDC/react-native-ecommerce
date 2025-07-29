import axios from "axios";

const authApi = axios.create({
  baseURL: "https://auth-api-wixi.onrender.com",
});

export default authApi;
