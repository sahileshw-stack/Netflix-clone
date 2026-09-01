import axios from "axios";

import ENV_CONFIG from "../config/envConfig";

import {
  getAdminAuthToken,
  removeAdminAuthToken,
} from "../Utils/adminAuth";

const axiosInstance = axios.create({
  baseURL: ENV_CONFIG.BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAdminAuthToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      removeAdminAuthToken();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;