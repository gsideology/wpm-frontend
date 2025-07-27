# Forecast Demand for Each Product

This document outlines a practical approach to move from sales forecasting to actionable inventory and purchasing recommendations for WooCommerce or retail businesses.

---

## 1. Forecast Demand for Each Product

- Use your best model (Prophet, XGBoost, or ensemble) to predict sales for each product for the next year (or season).
- Output: For each product, a monthly or weekly sales forecast for the next 12 months.

## 2. Estimate Safety Stock and Lead Time

- Gather or estimate:
  - **Supplier lead time** (days/weeks from order to delivery)
  - **Desired service level** (e.g., 95% chance of not running out)
  - **Sales variability** (standard deviation of forecast errors)
- Calculate **safety stock**:
  ```
  Safety Stock = Z * σL
  ```
  Where Z = service level factor (e.g., 1.65 for 95%), σL = std deviation of demand during lead time.

## 3. Calculate Reorder Points and Order Quantities

- **Reorder Point (ROP):**
  ```
  ROP = (Average daily demand × Lead time) + Safety Stock
  ```
- **Order Quantity:**
  - Use Economic Order Quantity (EOQ) or simply forecasted demand for the next replenishment period.

## 4. Inventory Optimization

- For each product, recommend:
  - When to reorder (based on forecast and current stock)
  - How much to order (to cover forecasted demand + safety stock)
- Optionally, factor in:
  - Minimum order quantities
  - Supplier constraints
  - Budget limits

## 5. Actionable Output

- Generate a report or dashboard with:
  - Product
  - Forecasted demand (next year, by month)
  - Recommended order quantity
  - Suggested reorder dates
  - Safety stock levels

---

## Suggested Next Steps

1. Add a script to calculate safety stock and reorder points for each product using your forecast.
2. Integrate this with your forecast output.
3. Create a simple report (CSV or dashboard) listing what to buy, how much, and when.

---

## Script: Safety Stock and Reorder Point Calculator

A Python script (`models/safety_stock_and_reorder.py`) is provided to automate the calculation of safety stock and reorder points for each product using your sales or forecast data.

**Purpose:**

- Calculates safety stock and reorder points for each product based on historical or forecasted sales.
- Outputs a CSV report with actionable inventory recommendations.

**Usage:**

1. Ensure your sales or forecast data is saved as `sales_with_features.csv` (UTF-8 encoded, with columns: `date`, `product`, `sales`, etc.).
2. Adjust the parameters in the script for lead time, service level, and current stock as needed.
3. Run the script:
   ```
   python models/safety_stock_and_reorder.py
   ```
4. The script will generate `safety_stock_and_reorder_report.csv` with the following columns for each product:
   - Product
   - Average daily demand
   - Standard deviation of daily demand
   - Demand during lead time
   - Safety stock
   - Reorder point
   - Current stock
   - Recommended order quantity

**This script bridges the gap between demand forecasting and real-world inventory management, enabling data-driven purchasing decisions.**

---

**This approach bridges the gap between demand forecasting and real-world inventory management, enabling data-driven purchasing decisions.**

### Script Parameters Explained

- **LEAD_TIME_DAYS**: The number of days between placing an order and receiving new stock from the supplier. Determines how much demand you need to cover while waiting for delivery.
- **SERVICE_LEVEL**: The desired probability (e.g., 0.95 for 95%) of not running out of stock during the lead time. Higher service levels increase safety stock.
- **Z**: The Z-score corresponding to the chosen service level (automatically calculated in the script). Used in the safety stock formula to reflect the desired service level.
- **CURRENT_STOCK**: The current inventory level for each product (can be set globally or per product). Used to determine if and how much to reorder.

#### Output Columns Explained

- **Product**: The name or identifier of the product for which the calculations are made.
- **Average daily demand**: The mean number of units sold per day, calculated from historical or forecasted sales data. Used to estimate future needs.
- **Standard deviation of daily demand**: A measure of how much daily sales fluctuate for the product. Higher values indicate more variable demand, which increases safety stock.
- **Demand during lead time**: The expected total sales for the product during the supplier lead time (Average daily demand × Lead time in days). This is the amount you expect to sell while waiting for a new order to arrive.
- **Safety stock**: Extra inventory kept to protect against demand spikes or supply delays during lead time. Calculated based on demand variability and desired service level.
- **Reorder point**: The inventory level at which a new order should be placed. It is the sum of expected demand during lead time and safety stock. When your stock falls to this level, you should reorder to avoid running out.
- **Current stock**: The present inventory level for the product (as set in the script or per product). Used to determine if a reorder is needed.
- **Recommended order quantity**: The suggested number of units to order to bring your stock up to the reorder point, ensuring you can meet demand until the next delivery. If your current stock is above the reorder point, this will be zero.
