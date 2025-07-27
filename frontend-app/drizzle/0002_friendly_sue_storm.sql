DROP MATERIALIZED VIEW "public"."dashboard_summary";--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."dashboard_summary" AS (
  SELECT
    organization_id as "organizationId",
    COUNT(DISTINCT product_id) as "totalProducts",
    SUM(forecasted_sales) as "totalForecastedSales"
  FROM sales_forecasts
  GROUP BY organization_id
);