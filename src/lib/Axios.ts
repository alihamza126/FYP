import axios from "axios";
import { getSession } from "next-auth/react";

// Create a custom Axios instance
const Axios = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// Add a request interceptor to include the token in all requests
Axios.interceptors.request.use(
   async (config) => {
      // Get the session (and token) from NextAuth
      const session = await getSession();

      // If there's a token in the session, add it to the request headers
      if (session?.accessToken) {
         config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Add a response interceptor to handle token expiration
Axios.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      // If the error is 401 (Unauthorized) and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;

         // Here you could implement token refresh logic if needed
         // For now, we'll just redirect to login
         window.location.href = "/login";
         return Promise.reject(error);
      }

      return Promise.reject(error);
   }
);

export default Axios;
