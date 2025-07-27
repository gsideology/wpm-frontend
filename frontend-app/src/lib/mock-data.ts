// Mock data service for development and testing
import { DashboardData, Organization, SalesForecast, WooCommerceProduct, WooCommerceOrder, ApiResponse } from './api';

// Mock dashboard data
export const mockDashboardData: DashboardData = {
  totalProducts: 156,
  totalForecastedSales: 45280.50,
  organizationId: 1
};

// Mock organizations
export const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "TechStore Italia",
    stripeCustomerId: "cus_techstore_001",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-03-20T14:45:00Z"
  },
  {
    id: 2,
    name: "Fashion Boutique Milano",
    stripeCustomerId: "cus_fashion_002",
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-03-18T16:20:00Z"
  }
];

// Mock sales forecasts
export const mockSalesForecasts: SalesForecast[] = [
  {
    id: 1,
    productId: 101,
    forecastedSales: 1250.00,
    forecastDate: "2024-04-01T00:00:00Z",
    organizationId: 1
  },
  {
    id: 2,
    productId: 102,
    forecastedSales: 890.50,
    forecastDate: "2024-04-01T00:00:00Z",
    organizationId: 1
  },
  {
    id: 3,
    productId: 103,
    forecastedSales: 2100.75,
    forecastDate: "2024-04-01T00:00:00Z",
    organizationId: 1
  }
];

// Mock WooCommerce products
export const mockWooCommerceProducts: WooCommerceProduct[] = [
  {
    id: 101,
    name: "iPhone 15 Pro Max",
    price: "1299.00",
    status: "publish",
    stockQuantity: 25
  },
  {
    id: 102,
    name: "MacBook Air M3",
    price: "1199.00",
    status: "publish",
    stockQuantity: 15
  },
  {
    id: 103,
    name: "AirPods Pro",
    price: "249.00",
    status: "publish",
    stockQuantity: 50
  },
  {
    id: 104,
    name: "iPad Air",
    price: "599.00",
    status: "publish",
    stockQuantity: 30
  }
];

// Mock WooCommerce orders
export const mockWooCommerceOrders: WooCommerceOrder[] = [
  {
    id: 1001,
    status: "completed",
    total: "1548.00",
    dateCreated: "2024-03-20T10:30:00Z",
    customerId: 201
  },
  {
    id: 1002,
    status: "processing",
    total: "599.00",
    dateCreated: "2024-03-19T14:15:00Z",
    customerId: 202
  },
  {
    id: 1003,
    status: "completed",
    total: "249.00",
    dateCreated: "2024-03-18T09:45:00Z",
    customerId: 203
  }
];

// Mock API service that simulates network delays
class MockApiService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private simulateError(probability: number = 0.1): boolean {
    return Math.random() < probability;
  }

  // Dashboard endpoints
  async getDashboardData(organizationId: number): Promise<ApiResponse<DashboardData>> {
    await this.delay(800);
    
    if (this.simulateError(0.05)) {
      return {
        success: false,
        error: "Failed to fetch dashboard data"
      };
    }

    return {
      success: true,
      data: {
        ...mockDashboardData,
        organizationId
      }
    };
  }

  async getDashboardSummary(organizationId: number): Promise<ApiResponse<DashboardData>> {
    await this.delay(600);
    
    return {
      success: true,
      data: {
        ...mockDashboardData,
        organizationId
      }
    };
  }

  // Organizations endpoints
  async getOrganizations(): Promise<ApiResponse<Organization[]>> {
    await this.delay(700);
    
    return {
      success: true,
      data: mockOrganizations
    };
  }

  async getOrganization(id: number): Promise<ApiResponse<Organization>> {
    await this.delay(500);
    
    const organization = mockOrganizations.find(org => org.id === id);
    
    if (!organization) {
      return {
        success: false,
        error: "Organization not found"
      };
    }

    return {
      success: true,
      data: organization
    };
  }

  // Sales forecasts endpoints
  async getSalesForecasts(organizationId: number): Promise<ApiResponse<SalesForecast[]>> {
    await this.delay(600);
    
    const forecasts = mockSalesForecasts.filter(forecast => forecast.organizationId === organizationId);
    
    return {
      success: true,
      data: forecasts
    };
  }

  async createSalesForecast(data: Omit<SalesForecast, 'id' | 'forecastDate'>): Promise<ApiResponse<SalesForecast>> {
    await this.delay(1000);
    
    const newForecast: SalesForecast = {
      id: Math.floor(Math.random() * 1000) + 100,
      ...data,
      forecastDate: new Date().toISOString()
    };

    return {
      success: true,
      data: newForecast
    };
  }

  async updateSalesForecast(id: number, data: Partial<SalesForecast>): Promise<ApiResponse<SalesForecast>> {
    await this.delay(800);
    
    const existingForecast = mockSalesForecasts.find(f => f.id === id);
    
    if (!existingForecast) {
      return {
        success: false,
        error: "Sales forecast not found"
      };
    }

    const updatedForecast = { ...existingForecast, ...data };
    
    return {
      success: true,
      data: updatedForecast
    };
  }

  async deleteSalesForecast(id: number): Promise<ApiResponse<void>> {
    await this.delay(500);
    
    const exists = mockSalesForecasts.some(f => f.id === id);
    
    if (!exists) {
      return {
        success: false,
        error: "Sales forecast not found"
      };
    }

    return {
      success: true
    };
  }

  // WooCommerce integration endpoints
  async syncWooCommerceData(organizationId: number): Promise<ApiResponse<{ message: string }>> {
    await this.delay(2000); // Simulate longer sync time
    
    if (this.simulateError(0.15)) {
      return {
        success: false,
        error: "WooCommerce sync failed"
      };
    }

    return {
      success: true,
      data: {
        message: `Successfully synced ${mockWooCommerceProducts.length} products and ${mockWooCommerceOrders.length} orders for organization ${organizationId}`
      }
    };
  }

  async getWooCommerceProducts(organizationId: number): Promise<ApiResponse<WooCommerceProduct[]>> {
    await this.delay(900);
    
    return {
      success: true,
      data: mockWooCommerceProducts
    };
  }

  async getWooCommerceOrders(organizationId: number): Promise<ApiResponse<WooCommerceOrder[]>> {
    await this.delay(800);
    
    return {
      success: true,
      data: mockWooCommerceOrders
    };
  }
}

export const mockApiService = new MockApiService(); 