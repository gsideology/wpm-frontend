"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardData } from '../lib/api';
import { apiService } from '../lib/api';
// import { mockApiService } from '../lib/mock-data'; // Uncomment to use mock data instead of backend

// Mock function for getting organization ID - replace with actual Better Auth implementation
function getOrganizationId(): number {
  // This is a placeholder - replace with actual Better Auth implementation
  return 1; // Mock organization ID
}

export const useBackendDashboard = () => {
  const queryClient = useQueryClient();
  const orgId = getOrganizationId();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['backend-dashboard', orgId],
    queryFn: async () => {
      // Use real backend API
      const response = await apiService.getDashboardSummary(orgId);
      
      // Alternative: Use mock data (uncomment the line below and comment the line above)
      // const response = await mockApiService.getDashboardSummary(orgId);
      
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch dashboard data');
    },
    enabled: !!orgId,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      // Use real backend API
      const response = await apiService.getDashboardData(orgId);
      
      // Alternative: Use mock data (uncomment the line below and comment the line above)
      // const response = await mockApiService.getDashboardData(orgId);
      
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to refresh dashboard data');
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['backend-dashboard', orgId], newData);
    },
  });

  const syncWooCommerceMutation = useMutation({
    mutationFn: async () => {
      // Use real backend API
      const response = await apiService.syncWooCommerceData(orgId);
      
      // Alternative: Use mock data (uncomment the line below and comment the line above)
      // const response = await mockApiService.syncWooCommerceData(orgId);
      
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to sync WooCommerce data');
    },
    onSuccess: () => {
      // Refetch dashboard data after sync
      queryClient.invalidateQueries({ queryKey: ['backend-dashboard', orgId] });
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    refresh: refreshMutation.mutate,
    isRefreshing: refreshMutation.isPending,
    syncWooCommerce: syncWooCommerceMutation.mutate,
    isSyncing: syncWooCommerceMutation.isPending,
  };
}; 