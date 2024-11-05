// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to include the access token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
  (response) => response, // Return the response directly if successful
  async (error) => {
    const originalRequest = error.config;

    // Check if the error status is 401 and the original request has not been retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        // Attempt to refresh the token
        const refreshToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('refreshToken='))
          ?.split('=')[1];

        const { data } = await api.post('/refresh-token', {}, { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true // Send cookies with the request
        });

        // Store the new access token
        localStorage.setItem('token', data.accessToken);
        // Update the Authorization header for the original request
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Handle the case where refreshing the token fails (e.g., logout the user)
        // Optionally, you can navigate to the login page or clear tokens
        localStorage.removeItem('token');
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Redirect to login or show an error message
      }
    }

    return Promise.reject(error); // Reject the error if not a 401 or if refresh fails
  }
);

export default api;
