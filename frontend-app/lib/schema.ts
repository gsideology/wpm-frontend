import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { pgView } from 'drizzle-orm/pg-core';

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

// Materialized view for dashboard summary
export const dashboardSummary = pgView('dashboard_summary', {
  organizationId: integer('organization_id'),
  totalProducts: integer('total_products'),
  totalForecastedSales: integer('total_forecasted_sales'),
}); 