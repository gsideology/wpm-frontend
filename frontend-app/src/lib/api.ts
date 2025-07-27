// API service layer for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DashboardData {
  totalProducts: number;
  totalForecastedSales: number;
  organizationId: number;
}

export interface Organization {
  id: number;
  name: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesForecast {
  id: number;
  productId: number;
  forecastedSales: number;
  forecastDate: string;
  organizationId: number;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  status: string;
  stockQuantity?: number;
}

export interface WooCommerceOrder {
  id: number;
  status: string;
  total: string;
  dateCreated: string;
  customerId?: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  organizationId: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return token;
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      };
      
      const response = await fetch(url, {
        headers,
        ...options,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.removeToken();
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.data?.access_token) {
        this.setToken(data.data.access_token);
      }
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success && data.data?.access_token) {
        this.setToken(data.data.access_token);
      }
      
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Dashboard endpoints
  async getDashboardData(organizationId: number): Promise<ApiResponse<DashboardData>> {
    return this.request<DashboardData>(`/api/dashboard/${organizationId}`);
  }

  async getDashboardSummary(organizationId: number): Promise<ApiResponse<DashboardData>> {
    return this.request<DashboardData>(`/api/dashboard/summary/${organizationId}`);
  }

  // Organizations endpoints
  async getOrganizations(): Promise<ApiResponse<Organization[]>> {
    return this.request<Organization[]>('/api/organizations');
  }

  async getOrganization(id: number): Promise<ApiResponse<Organization>> {
    return this.request<Organization>(`/api/organizations/${id}`);
  }

  // Sales forecasts endpoints
  async getSalesForecasts(organizationId: number): Promise<ApiResponse<SalesForecast[]>> {
    return this.request<SalesForecast[]>(`/api/sales-forecasts/${organizationId}`);
  }

  async createSalesForecast(data: Omit<SalesForecast, 'id' | 'forecastDate'>): Promise<ApiResponse<SalesForecast>> {
    return this.request<SalesForecast>('/api/sales-forecasts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSalesForecast(id: number, data: Partial<SalesForecast>): Promise<ApiResponse<SalesForecast>> {
    return this.request<SalesForecast>(`/api/sales-forecasts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSalesForecast(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/sales-forecasts/${id}`, {
      method: 'DELETE',
    });
  }

  // WooCommerce integration endpoints
  async syncWooCommerceData(organizationId: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/woocommerce/sync/${organizationId}`, {
      method: 'POST',
    });
  }

  async getWooCommerceProducts(organizationId: number): Promise<ApiResponse<WooCommerceProduct[]>> {
    return this.request<WooCommerceProduct[]>(`/api/woocommerce/products/${organizationId}`);
  }

  async getWooCommerceOrders(organizationId: number): Promise<ApiResponse<WooCommerceOrder[]>> {
    return this.request<WooCommerceOrder[]>(`/api/woocommerce/orders/${organizationId}`);
  }
}

export const apiService = new ApiService(); 