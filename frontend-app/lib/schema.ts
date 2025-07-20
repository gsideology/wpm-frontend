import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { pgMaterializedView } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Tabella per le organizzazioni (aziende)
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  stripeCustomerId: text('stripe_customer_id'), // Per l'integrazione con Stripe
});

// Esempio: tabella delle previsioni di vendita
export const salesForecasts = pgTable('sales_forecasts', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  forecastedSales: integer('forecasted_sales').notNull(),
  forecastDate: timestamp('forecast_date').defaultNow(),
  // Chiave esterna che lega la previsione a un'organizzazione
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
});

// Materialized view for dashboard summary - with explicit column mapping
export const dashboardSummary = pgMaterializedView('dashboard_summary', {
  organizationId: integer('organizationId'),
  totalProducts: integer('totalProducts'),
  totalForecastedSales: integer('totalForecastedSales'),
}).as(sql`
  SELECT
    organization_id as "organizationId",
    COUNT(DISTINCT product_id) as "totalProducts",
    SUM(forecasted_sales) as "totalForecastedSales"
  FROM sales_forecasts
  GROUP BY organization_id
`); 