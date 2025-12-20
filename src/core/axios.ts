import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { AUTH_TOKEN_KEY, AUTH_ROLE_KEY, getCookie, removeCookie } from "../utils/cookieUtils";

class ApiRequest {
  private static instance: ApiRequest;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    // Add request interceptor to automatically include JWT token from cookies
    this.api.interceptors.request.use(
      (config) => {
        const token = getCookie(AUTH_TOKEN_KEY);
        const role = getCookie(AUTH_ROLE_KEY);
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('📤 API Request:', {
            url: config.url,
            method: config.method,
            hasToken: true,
            role,
          });
        } else {
          console.log('📤 API Request (no token):', {
            url: config.url,
            method: config.method,
          });
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => {
        console.log('📥 API Response:', {
          url: response.config.url,
          status: response.status,
        });
        return response;
      },
      (error) => {
        console.error('📥 API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message,
        });
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn('🚫 Auth error detected, clearing cookies');
          
          // Token is invalid or expired, clear cookies and redirect to login
          removeCookie(AUTH_TOKEN_KEY);
          removeCookie(AUTH_ROLE_KEY);
          
          // Only redirect if not already on login or signup page
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/signup') {
            console.warn('🔄 Redirecting to login...');
            
            // Show user-friendly message
            const errorMessage = error.response?.data?.error;
            if (errorMessage === 'Token expired') {
              alert('Your session has expired. Please log in again.');
            } else if (error.response?.data?.message?.includes('Invalid or expired')) {
              alert('Your session is invalid. Please log in again.');
            }
            
            setTimeout(() => {
              window.location.href = '/login';
            }, 500);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiRequest {
    if (!ApiRequest.instance) {
      ApiRequest.instance = new ApiRequest();
    }
    return ApiRequest.instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(url, config);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  }
  
  // --- ADDED PATCH METHOD ---
  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  }
  // --------------------------

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(url, config);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  }
}

const apiRequest = ApiRequest.getInstance();
Object.freeze(apiRequest);

export default apiRequest;