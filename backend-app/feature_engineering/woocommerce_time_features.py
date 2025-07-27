import pandas as pd

# Load cleaned sales data
df = pd.read_csv('cleaned_sales.csv', parse_dates=['date'])

# Time-based features
df['day_of_week'] = df['date'].dt.dayofweek
# Monday=0, Sunday=6
df['month'] = df['date'].dt.month
df['quarter'] = df['date'].dt.quarter
df['year'] = df['date'].dt.year

df['day_of_year'] = df['date'].dt.dayofyear

df = df.sort_values(['product', 'date'])

# Rolling average sales (7 days, min_periods=1)
df['sales_rolling_7'] = df.groupby('product')['sales'].transform(lambda x: x.rolling(7, min_periods=1).mean())

# Lag features (previous day's sales)
df['sales_lag_1'] = df.groupby('product')['sales'].shift(1)

df.to_csv('woocommerce_sales_with_features.csv', index=False)
print('Feature-engineered data saved to woocommerce_sales_with_features.csv') 