"use server";

import { apiService, DashboardData } from '../../lib/api';

// Mock function for getting organization ID - replace with actual Better Auth implementation
async function getOrganizationId(): Promise<number | null> {
  // This is a placeholder - replace with actual Better Auth implementation
  return 1; // Mock organization ID
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const orgId = await getOrganizationId();
  if (!orgId) return null;

  try {
    // Use the backend API instead of direct database queries
    const response = await apiService.getDashboardSummary(orgId);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      console.error('API request failed:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return null;
  }
}

export async function refreshDashboardData(): Promise<DashboardData | null> {
  const orgId = await getOrganizationId();
  if (!orgId) return null;

  try {
    // Force refresh by calling the dashboard data endpoint
    const response = await apiService.getDashboardData(orgId);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      console.error('API refresh failed:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Dashboard refresh error:', error);
    return null;
  }
} 