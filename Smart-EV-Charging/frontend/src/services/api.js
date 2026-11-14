import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create Axios client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ev_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent response data & error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'API request failed',
      status: error.response?.status,
      data: error.response?.data
    };
    if (error.response?.status === 401) {
      // Optional: handle session expiry
      console.warn('Authentication expired or invalid');
    }
    return Promise.reject(customError);
  }
);

// 1. Authentication APIs
export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me')
};

// 2. Charging Stations APIs
export const stationsApi = {
  getAll: () => apiClient.get('/stations'),
  getById: (id) => apiClient.get(`/stations/${id}`),
  create: (data) => apiClient.post('/stations', data),
  update: (id, data) => apiClient.put(`/stations/${id}`, data),
  delete: (id) => apiClient.delete(`/stations/${id}`),
  toggleStatus: (id) => apiClient.patch(`/admin/stations/${id}/toggle-status`),
  updatePortStatus: (portId, status) => apiClient.patch(`/stations/ports/${portId}/status`, { status }),
  simulateState: (id, state) => apiClient.post(`/stations/${id}/simulate-state`, { state }),
  simulateTick: () => apiClient.post('/stations/simulate-tick')
};

// 3. Vehicles APIs
export const vehiclesApi = {
  getAll: (all = false) => apiClient.get(`/vehicles${all ? '?all=true' : ''}`),
  getFleet: () => apiClient.get('/vehicles/fleet'),
  add: (data) => apiClient.post('/vehicles', data),
  update: (id, data) => apiClient.put(`/vehicles/${id}`, data),
  delete: (id) => apiClient.delete(`/vehicles/${id}`)
};

// 4. Bookings APIs
export const bookingsApi = {
  getAll: (params) => apiClient.get('/bookings', { params }),
  create: (data) => apiClient.post('/bookings', data),
  cancel: (id) => apiClient.patch(`/bookings/${id}/cancel`),
  getMyBookings: () => apiClient.get('/bookings/my-bookings')
};

// 5. Charging Sessions APIs
export const sessionsApi = {
  getAll: (params) => apiClient.get('/sessions', { params }),
  getActive: () => apiClient.get('/sessions/active'),
  start: (data) => apiClient.post('/sessions/start', data),
  stop: (id, data) => apiClient.post(`/sessions/${id}/stop`, data),
  getById: (id) => apiClient.get(`/sessions/${id}`)
};

// 6. Energy Consumption APIs
export const energyApi = {
  getAll: (params) => apiClient.get('/energy', { params }),
  getSummary: () => apiClient.get('/energy/summary')
};

// 7. Payments APIs
export const paymentsApi = {
  getAll: (params) => apiClient.get('/payments', { params }),
  process: (data) => apiClient.post('/payments/process', data),
  getMyPayments: () => apiClient.get('/payments/my-payments')
};

// 8. Admin Suite APIs
export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: () => apiClient.get('/admin/users'),
  toggleUserStatus: (userId, isActive) => apiClient.patch(`/admin/users/${userId}/status`, { is_active: isActive }),
  getAllBookings: () => apiClient.get('/admin/bookings'),
  getAllPayments: () => apiClient.get('/admin/payments'),
  getMaintenanceLogs: () => apiClient.get('/admin/maintenance')
};

// 9. Dashboard Aggregated Stats API
export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats')
};

export default apiClient;
