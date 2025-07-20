"use server";

import { db } from '../../../lib/db';
import { sql } from 'drizzle-orm';

// Mock function for getting organization ID - replace with actual Better Auth implementation
async function getOrganizationId(): Promise<number | null> {
  // This is a placeholder - replace with actual Better Auth implementation
  return 1; // Mock organization ID
}

export async function getDashboardData() {
  const orgId = await getOrganizationId();
  if (!orgId) return null;

  // Query data from the materialized view for better performance
  const data = await db.execute(sql`
    SELECT total_products, total_forecasted_sales 
    FROM dashboard_summary 
    WHERE organization_id = ${orgId}
  `);

  // Transform the data to match the frontend expectations
  if (data[0]) {
    const row = data[0] as { total_products: string; total_forecasted_sales: string };
    return {
      totalProducts: parseInt(row.total_products),
      totalForecastedSales: parseInt(row.total_forecasted_sales)
    };
  }

  return null;
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