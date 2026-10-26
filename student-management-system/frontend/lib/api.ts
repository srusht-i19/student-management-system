import axios, { AxiosError } from 'axios';
import type { Student, StudentInput } from '@/types/student';

export const TOKEN_KEY = 'sms_token';
export const USER_KEY = 'sms_user';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
});

// Attach the JWT to every request.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Expired / invalid token on a protected call -> back to login.
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const isLoginCall = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginCall && typeof window !== 'undefined') {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export function saveSession(token: string, email: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Turns any thrown error into a message that is safe to show to a person. */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Cannot reach the server. Check that the backend is running.';
    const msg = err.response.data?.message;
    if (Array.isArray(msg)) return msg.join('. ');
    if (typeof msg === 'string') return msg;
  }
  return 'Something went wrong. Please try again.';
}

export const login = (email: string, password: string) =>
  api
    .post<{ accessToken: string; user: { email: string } }>('/auth/login', { email, password })
    .then((r) => r.data);

export const getStudents = (search?: string) =>
  api.get<Student[]>('/students', { params: search ? { search } : {} }).then((r) => r.data);

export const getStudent = (id: number | string) =>
  api.get<{ student: Student }>(`/students/${id}`).then((r) => r.data.student);

export const createStudent = (data: StudentInput) =>
  api.post<{ student: Student }>('/students', data).then((r) => r.data.student);

export const updateStudent = (id: number | string, data: StudentInput) =>
  api.put<{ student: Student }>(`/students/${id}`, data).then((r) => r.data.student);

export const deleteStudent = (id: number) =>
  api.delete<{ message: string }>(`/students/${id}`).then((r) => r.data);
