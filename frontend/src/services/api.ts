import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('noq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('noq_token');
      localStorage.removeItem('noq_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login:    (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe:    () => api.get('/auth/me'),
  register: (data: object) => api.post('/auth/register', data),
};

export const patientsAPI = {
  list:   (params?: object) => api.get('/patients', { params }),
  get:    (id: string)      => api.get(`/patients/${id}`),
  create: (data: object)    => api.post('/patients', data),
  update: (id: string, data: object) => api.put(`/patients/${id}`, data),
  delete: (id: string)      => api.delete(`/patients/${id}`),
  stats:  ()                => api.get('/patients/stats'),
};

export const doctorsAPI = {
  list:   (params?: object) => api.get('/doctors', { params }),
  get:    (id: string)      => api.get(`/doctors/${id}`),
  create: (data: object)    => api.post('/doctors', data),
  update: (id: string, data: object) => api.put(`/doctors/${id}`, data),
  delete: (id: string)      => api.delete(`/doctors/${id}`),
};

export const appointmentsAPI = {
  list:         (params?: object) => api.get('/appointments', { params }),
  get:          (id: string)      => api.get(`/appointments/${id}`),
  create:       (data: object)    => api.post('/appointments', data),
  update:       (id: string, data: object) => api.put(`/appointments/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/appointments/${id}/status`, { status }),
  stats:        ()                => api.get('/appointments/stats'),
};

export const ticketsAPI = {
  list:         (params?: object) => api.get('/tickets', { params }),
  get:          (id: string)      => api.get(`/tickets/${id}`),
  create:       (data: object)    => api.post('/tickets', data),
  update:       (id: string, data: object) => api.put(`/tickets/${id}`, data),
  addMessage:   (id: string, text: string) => api.post(`/tickets/${id}/messages`, { text }),
  updateStatus: (id: string, status: string) => api.patch(`/tickets/${id}/status`, { status }),
};

export const usersAPI = {
  list:   (params?: object) => api.get('/users', { params }),
  create: (data: object)    => api.post('/users', data),
  update: (id: string, data: object) => api.put(`/users/${id}`, data),
  delete: (id: string)      => api.delete(`/users/${id}`),
};

export const clinicsAPI = {
  list:   (params?: object) => api.get('/clinics', { params }),
  create: (data: object)    => api.post('/clinics', data),
  update: (id: string, data: object) => api.put(`/clinics/${id}`, data),
  delete: (id: string)      => api.delete(`/clinics/${id}`),
};

export default api;
