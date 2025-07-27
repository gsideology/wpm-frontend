import pandas as pd

# Sample WooCommerce export file name
input_file = 'woocommerce_orders_export.csv'
output_file = 'cleaned_sales.csv'

# Read the WooCommerce export (assume UTF-8 and ',' separator)
df = pd.read_csv(input_file, parse_dates=['date_created'])

# Filter for completed orders only (if status column exists)
if 'status' in df.columns:
    df = df[df['status'].str.lower() == 'completed']

# Ensure necessary columns exist
required_cols = {'date_created', 'product_name', 'quantity'}
if not required_cols.issubset(df.columns):
    raise ValueError(f"Input file must contain columns: {required_cols}")

# Aggregate daily sales per product
df['date'] = df['date_created'].dt.date
agg = df.groupby(['date', 'product_name'])['quantity'].sum().reset_index()
agg = agg.rename(columns={'product_name': 'product', 'quantity': 'sales'})

# Save cleaned data
agg.to_csv(output_file, index=False)
print(f'Cleaned sales data saved to {output_file}') 