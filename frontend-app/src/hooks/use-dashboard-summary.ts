"use client";
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../app/actions/dashboard-actions'; // Server Action

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => getDashboardData(),
  });
}; 