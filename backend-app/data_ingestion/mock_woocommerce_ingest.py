import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Parameters
days = 365 * 2  # 2 years of data
products = ['Widget A', 'Widget B', 'Widget C']
np.random.seed(42)

rows = []
start_date = datetime.today() - timedelta(days=days)
for day in range(days):
    date = start_date + timedelta(days=day)
    for product in products:
        sales = np.random.poisson(lam=20 + 5 * np.sin(2 * np.pi * day / 365) + np.random.randn())
        rows.append({
            'date': date.strftime('%Y-%m-%d'),
            'product': product,
            'sales': max(sales, 0)
        })

df = pd.DataFrame(rows)
df.to_csv('mock_sales.csv', index=False)
print('Mock sales data saved to mock_sales.csv') 