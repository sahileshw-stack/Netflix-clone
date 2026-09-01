import axios from "axios";
import envConfig from "../config/envConfig";
import {
  getAuthToken,
  removeAuthToken,
} from "../utils/auth";

const axiosInstance = axios.create({
  baseURL: envConfig.BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;