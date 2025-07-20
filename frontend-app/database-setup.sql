-- Database setup script for WPM Frontend Application

-- Create materialized view for dashboard summary
CREATE MATERIALIZED VIEW dashboard_summary AS
SELECT
    organization_id,
    COUNT(DISTINCT product_id) AS total_products,
    SUM(forecasted_sales) AS total_forecasted_sales
FROM
    sales_forecasts
GROUP BY
    organization_id;

-- Create index for better performance
CREATE INDEX idx_dashboard_summary_org_id ON dashboard_summary(organization_id);

-- Refresh the materialized view (run this periodically)
-- REFRESH MATERIALIZED VIEW dashboard_summary; 