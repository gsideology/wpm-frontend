"""
Safety Stock and Reorder Point Calculator

This script calculates safety stock and reorder points for each product using historical or forecasted sales data.

Inputs:
- sales_with_features.csv: CSV file containing at least 'date', 'product', and 'sales' columns (UTF-8 encoded recommended).
- User-defined parameters (customize in the script):
    - LEAD_TIME_DAYS: Number of days between placing an order and receiving stock from the supplier. Affects how much demand you need to cover while waiting for new stock.
    - SERVICE_LEVEL: Desired probability (e.g., 0.95 for 95%) of not running out of stock during lead time. Higher values mean more safety stock.
    - Z: The Z-score corresponding to the chosen service level (automatically calculated from SERVICE_LEVEL). Used in the safety stock formula.
    - CURRENT_STOCK: The current inventory level for each product (can be set globally or per product). Used to determine if/when to reorder.

Outputs:
- safety_stock_and_reorder_report.csv: CSV report with safety stock, reorder point, and recommended order quantity for each product.

Formulas Used:
- Safety Stock = Z * σL, where Z is the service level factor (e.g., 1.65 for 95%), σL is the standard deviation of demand during lead time.
- Reorder Point (ROP) = (Average daily demand × Lead time) + Safety Stock
- Recommended Order Quantity = max(0, ROP - current stock)

Usage:
1. Ensure your sales data is in 'sales_with_features.csv' with correct columns and UTF-8 encoding.
2. Adjust LEAD_TIME_DAYS, SERVICE_LEVEL, and CURRENT_STOCK as needed in the script.
3. Run the script:
   python models/safety_stock_and_reorder.py
4. The output CSV will be saved in the project directory.

This script bridges demand forecasting and actionable inventory management, enabling data-driven purchasing decisions.
"""
import pandas as pd
import numpy as np
from scipy.stats import norm

# --- User Inputs (customize as needed) ---
LEAD_TIME_DAYS = 14  # Supplier lead time in days
SERVICE_LEVEL = 0.95  # Desired service level (e.g., 0.95 for 95%)
Z = norm.ppf(SERVICE_LEVEL)  # Z-score for service level
CURRENT_STOCK = 100  # Example: current stock for all products (customize per product if needed)

# --- Load forecasted sales data ---
# For demonstration, use the feature-engineered sales data as a proxy for forecast
# Replace with actual forecast output if available
sales_df = pd.read_csv('sales_with_features.csv', parse_dates=['date'], encoding='utf-7')

# Get unique products
products = sales_df['product'].unique()

results = []

for product in products:
    prod_df = sales_df[sales_df['product'] == product].copy()
    # Calculate average daily demand (mean sales)
    avg_daily_demand = prod_df['sales'].mean()
    # Calculate std deviation of daily demand (sales variability)
    std_daily_demand = prod_df['sales'].std()
    # Demand during lead time
    demand_lead_time = avg_daily_demand * LEAD_TIME_DAYS
    # Std deviation of demand during lead time
    std_lead_time = std_daily_demand * np.sqrt(LEAD_TIME_DAYS)
    # Safety stock
    safety_stock = Z * std_lead_time
    # Reorder point
    reorder_point = demand_lead_time + safety_stock
    # Example: recommended order quantity (to top up to cover next lead time + safety stock)
    recommended_order_qty = max(0, reorder_point - CURRENT_STOCK)
    results.append({
        'product': product,
        'avg_daily_demand': avg_daily_demand,
        'std_daily_demand': std_daily_demand,
        'demand_lead_time': demand_lead_time,
        'safety_stock': safety_stock,
        'reorder_point': reorder_point,
        'current_stock': CURRENT_STOCK,
        'recommended_order_qty': recommended_order_qty
    })

# Output results to CSV
results_df = pd.DataFrame(results)
results_df.to_csv('safety_stock_and_reorder_report.csv', index=False)
print('Safety stock and reorder report saved as safety_stock_and_reorder_report.csv') 

"""
- **Product**: The name or identifier of the product for which the calculations are made.
- **Average daily demand**: The mean number of units sold per day, calculated from historical or forecasted sales data. Used to estimate future needs.
- **Standard deviation of daily demand**: A measure of how much daily sales fluctuate for the product. Higher values indicate more variable demand, which increases safety stock.
- **Demand during lead time**: The expected total sales for the product during the supplier lead time (Average daily demand × Lead time in days). This is the amount you expect to sell while waiting for a new order to arrive.
- **Safety stock**: Extra inventory kept to protect against demand spikes or supply delays during lead time. Calculated based on demand variability and desired service level.
- **Reorder point**: The inventory level at which a new order should be placed. It is the sum of expected demand during lead time and safety stock. When your stock falls to this level, you should reorder to avoid running out.
- **Current stock**: The present inventory level for the product (as set in the script or per product). Used to determine if a reorder is needed.
- **Recommended order quantity**: The suggested number of units to order to bring your stock up to the reorder point, ensuring you can meet demand until the next delivery. If your current stock is above the reorder point, this will be zero.
"""
