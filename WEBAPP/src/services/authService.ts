import axios from 'axios';

const API_BASE = 'http://localhost:8000';

/**
 * loginUser — authenticate with email/phone + password
 * Saves token and redirects to dashboard on success
 */
export const loginUser = async (identifier: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE}/api/login`, {
      identifier,
      password,
    });

    // Save token and doctor name to localStorage
    saveToken(response.data.token);
    localStorage.setItem('doctorName', response.data.user?.name || 'Dr. Rahman');
    localStorage.setItem('userId', String(response.data.user?.id || ''));

    // Redirect to dashboard
    window.location.href = '/dashboard';

    return response.data;

  } catch (error: any) {
    // Extract error message from API response
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      'Invalid credentials. Please try again.';
    throw new Error(message);
  }
};

/**
 * loginWithGoogle — OAuth redirect flow
 */
export const loginWithGoogle = () => {
  window.location.href = `${API_BASE}/auth/google`;
};

/**
 * saveToken — save JWT to localStorage
 */
export const saveToken = (token: string) => {
  localStorage.setItem('token', token);
};

/**
 * getToken — retrieve JWT from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * clearToken — remove token (logout)
 */
export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('doctorName');
  localStorage.removeItem('userId');
};

/**
 * isAuthenticated — check if user has a token
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * logout — clear all auth data and redirect to login
 */
export const logout = () => {
  clearToken();
  window.location.href = '/login';
};

/**
 * getDoctorName — get logged in doctor name
 */
export const getDoctorName = (): string => {
  return localStorage.getItem('doctorName') || 'Dr. Rahman';
};