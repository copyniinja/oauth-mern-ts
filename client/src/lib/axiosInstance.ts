import { store } from "@/app/store";
import { logout, setCredential } from "@/features/auth/authSlice";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

type RetryRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

// refresh-token request is already happening or not
let isRefreshing = false;

//Stores all failed requests that arrived during the token refresh.
let refreshQueue: ((token: string) => void)[] = [];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Refresh Token(HTTP-only cookie) is sent automatically
});

// Attach access token in every request
api.interceptors.request.use((config) => {
  const { auth } = store.getState();
  const token = auth.user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response, // If response is OK then return response (If failed to to error block (next cb))
  async (error: AxiosError) => {
    const original = error.config as RetryRequestConfig;
    // Original failed request

    // Check this is an axios error : Sometimes error cannot be from server like : no internet,cors,dns
    if (!error.response) {
      return Promise.reject(error);
    }
    // If request failed with 401 and its the first retry
    if (error.response.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { withCredentials: true }
          );

          const newToken: string = res.data.accessToken;
          const { auth } = store.getState();
          store.dispatch(setCredential({ ...auth.user!, token: newToken }));

          refreshQueue.forEach((cb) => cb(newToken));
          refreshQueue = [];
          isRefreshing = false;

          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch (err) {
          isRefreshing = false;
          refreshQueue = [];
          store.dispatch(logout());
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        refreshQueue.push((newToken) => {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    return Promise.reject(error);
  }
);
