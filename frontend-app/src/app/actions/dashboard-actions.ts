"use server";

import { db } from '../../../lib/db';
import { dashboardSummary } from '../../../lib/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Mock function for getting organization ID - replace with actual Better Auth implementation
async function getOrganizationId(): Promise<number | null> {
  // This is a placeholder - replace with actual Better Auth implementation
  return 1; // Mock organization ID
}

export async function getDashboardData() {
  const orgId = await getOrganizationId();
  if (!orgId) return null;

  // Query data from the materialized view using type-safe Drizzle queries
  const data = await db
    .select({
      totalProducts: dashboardSummary.totalProducts,
      totalForecastedSales: dashboardSummary.totalForecastedSales,
    })
    .from(dashboardSummary)
    .where(eq(dashboardSummary.organizationId, orgId));

  return data[0] || null;
}

export async function refreshDashboardView() {
  try {
    // Refresh the materialized view to get latest data
    await db.execute(sql`REFRESH MATERIALIZED VIEW dashboard_summary`);
    return { success: true, message: 'Dashboard view refreshed successfully' };
  } catch (error) {
    console.error('Error refreshing dashboard view:', error);
    return { success: false, error: 'Failed to refresh dashboard view' };
  }
} 