"use server";

import { db } from '../../../lib/db';
import { salesForecasts } from '../../../lib/schema';
import { eq, sql } from 'drizzle-orm';

// Mock function for getting organization ID - replace with actual Better Auth implementation
async function getOrganizationId(): Promise<number | null> {
  // This is a placeholder - replace with actual Better Auth implementation
  return 1; // Mock organization ID
}

export async function getDashboardData() {
  const orgId = await getOrganizationId();
  if (!orgId) return null;

  // Query aggregated data from sales forecasts
  const data = await db
    .select({
      totalProducts: sql<number>`count(distinct ${salesForecasts.productId})`,
      totalForecastedSales: sql<number>`sum(${salesForecasts.forecastedSales})`,
    })
    .from(salesForecasts)
    .where(eq(salesForecasts.organizationId, orgId));

  return data[0] || null;
} 