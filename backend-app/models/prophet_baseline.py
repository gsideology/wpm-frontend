import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt

# Load feature-engineered data
df = pd.read_csv('sales_with_features.csv', parse_dates=['date'])

# Select one product for demonstration
product = 'Widget A'
df_prod = df[df['product'] == product].copy()

# Prophet expects columns: ds (date), y (value)
df_prophet = df_prod[['date', 'sales']].rename(columns={'date': 'ds', 'sales': 'y'})

# Fit Prophet model
model = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
model.fit(df_prophet)

# Make future dataframe for 90 days
days_ahead = 90
future = model.make_future_dataframe(periods=days_ahead)
forecast = model.predict(future)

# Plot forecast
fig = model.plot(forecast)
plt.title(f'Prophet Forecast for {product}')
plt.xlabel('Date')
plt.ylabel('Sales')
plt.tight_layout()
plt.savefig('prophet_forecast.png')
print('Forecast plot saved as prophet_forecast.png') 