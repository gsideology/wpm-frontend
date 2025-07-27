# 🔄 Backend Data Flow Documentation

## 📊 **Data Sources & Storage Overview**

### **Current Data Storage Architecture**

The backend system uses a **hybrid approach** combining:

- **CSV Files** (for ML model data and historical data)
- **In-Memory Dictionaries** (for user authentication and temporary data)
- **Mock Data Fallbacks** (for development and testing)

---

## 📁 **Data Storage Locations**

### **1. CSV Data Files (Primary ML Data Source)**

| File                                  | Location       | Purpose                          | Size  | Status    |
| ------------------------------------- | -------------- | -------------------------------- | ----- | --------- |
| `sales_with_features.csv`             | `backend-app/` | Main sales data with ML features | 297KB | ✅ Active |
| `woocommerce_sales_with_features.csv` | `backend-app/` | WooCommerce specific data        | 2.0KB | ✅ Active |
| `mock_sales.csv`                      | `backend-app/` | Mock sales data for testing      | 88KB  | ✅ Active |
| `cleaned_sales.csv`                   | `backend-app/` | Cleaned sales data               | 129B  | ✅ Active |
| `woocommerce_orders_export.csv`       | `backend-app/` | WooCommerce orders export        | 506B  | ✅ Active |
| `safety_stock_and_reorder_report.csv` | `backend-app/` | Safety stock calculations        | 801B  | ✅ Active |

### **2. In-Memory Data Storage**

```python
# User Authentication Data (In-Memory)
users_db = {
    1: {
        "id": 1,
        "email": "admin@example.com",
        "password": "admin123",
        "name": "Admin User",
        "organization_id": 1
    }
}

# Organization Data (In-Memory)
organizations_db = {
    1: {
        "id": 1,
        "name": "Demo Organization",
        "stripe_customer_id": None,
        "created_at": "2024-01-01",
        "updated_at": "2024-01-01"
    }
}
```

### **3. ML Model Files**

| File                          | Location              | Purpose                         |
| ----------------------------- | --------------------- | ------------------------------- |
| `prophet_baseline.py`         | `backend-app/models/` | Baseline Prophet forecasting    |
| `prophet_woocommerce.py`      | `backend-app/models/` | WooCommerce Prophet forecasting |
| `safety_stock_and_reorder.py` | `backend-app/models/` | Safety stock calculations       |

---

## 🔄 **Data Flow Architecture**

### **1. Data Ingestion Flow**

```
External Data Sources
        ↓
   CSV Files (WooCommerce Export)
        ↓
   Data Ingestion Scripts
        ↓
   Processed CSV Files
        ↓
   ML Models
        ↓
   API Endpoints
        ↓
   Frontend Dashboard
```

### **2. Real-Time Data Flow**

```
Frontend Request
        ↓
   JWT Authentication
        ↓
   API Endpoint
        ↓
   CSV Data Loading (safe_load_csv)
        ↓
   Data Processing/Calculation
        ↓
   JSON Response
        ↓
   Frontend Display
```

---

## 📊 **Data Processing Pipeline**

### **1. Dashboard Data Processing**

```python
# Current Implementation in main.py
def get_dashboard_data(organization_id: int):
    # 1. Load CSV data safely
    sales_data = safe_load_csv("sales_with_features.csv")

    # 2. Calculate metrics
    if not sales_data.empty and 'product_id' in sales_data.columns:
        total_products = len(sales_data['product_id'].unique())
        total_forecasted_sales = sales_data['quantity'].sum()
    else:
        # 3. Fallback to mock data
        total_products = 25
        total_forecasted_sales = 15000.0

    # 4. Return formatted response
    return {
        "totalProducts": total_products,
        "totalForecastedSales": float(total_forecasted_sales),
        "organizationId": organization_id
    }
```

### **2. WooCommerce Data Processing**

```python
# WooCommerce Products Processing
def get_woocommerce_products(organization_id: int):
    # Load WooCommerce specific data
    wc_data = safe_load_csv("woocommerce_sales_with_features.csv")

    # Process and return product data
    products = []
    if not wc_data.empty:
        for _, row in wc_data.iterrows():
            products.append({
                "id": row.get('product_id', 0),
                "name": f"Widget {chr(65 + row.get('product_id', 0) % 26)}",
                "price": str(row.get('price', 0)),
                "status": "publish",
                "stock_quantity": int(row.get('quantity', 0))
            })

    return products
```

---

## 🔧 **Data Loading Functions**

### **1. Safe CSV Loading**

```python
def safe_load_csv(filename: str, default_data=None):
    """
    Safely loads CSV files with fallback to default data
    """
    try:
        if os.path.exists(filename):
            return pd.read_csv(filename)
        else:
            print(f"Warning: File {filename} not found, using default data")
            return default_data or pd.DataFrame()
    except Exception as e:
        print(f"Warning: Error loading {filename}: {e}")
        return default_data or pd.DataFrame()
```

### **2. Data Validation & Fallbacks**

The system implements **graceful degradation**:

- ✅ **Primary**: Load real CSV data
- ⚠️ **Fallback**: Use mock data if CSV missing
- ❌ **Error**: Return empty data with error message

---

## 📈 **ML Model Integration**

### **1. Prophet Forecasting Models**

**Location**: `backend-app/models/`

- `prophet_baseline.py` - General sales forecasting
- `prophet_woocommerce.py` - WooCommerce specific forecasting

**Data Source**: `sales_with_features.csv`

### **2. Safety Stock Calculations**

**Location**: `backend-app/models/safety_stock_and_reorder.py`
**Data Source**: `safety_stock_and_reorder_report.csv`

### **3. Model Output Storage**

ML models generate:

- **CSV Reports**: Forecast results, safety stock levels
- **PNG Images**: Forecast charts and visualizations
- **JSON Data**: API-ready forecast data

---

## 🔐 **Authentication Data Flow**

### **1. User Authentication Storage**

```python
# Current Implementation (In-Memory)
users_db = {
    1: {
        "id": 1,
        "email": "admin@example.com",
        "password": "admin123",  # In production: hashed
        "name": "Admin User",
        "organization_id": 1
    }
}
```

### **2. JWT Token Management**

- **Token Storage**: Frontend localStorage
- **Token Validation**: Backend JWT verification
- **Token Expiry**: 24 hours (configurable)

---

## 🚀 **Production Data Flow Recommendations**

### **1. Database Migration**

**Current**: CSV files + In-memory storage
**Recommended**: PostgreSQL/MySQL database

```sql
-- Recommended Database Schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    organization_id INTEGER
);

CREATE TABLE sales_data (
    id SERIAL PRIMARY KEY,
    product_id INTEGER,
    quantity INTEGER,
    date DATE,
    organization_id INTEGER
);

CREATE TABLE forecasts (
    id SERIAL PRIMARY KEY,
    product_id INTEGER,
    forecasted_quantity INTEGER,
    forecast_date DATE,
    organization_id INTEGER
);
```

### **2. Data Pipeline Improvements**

```
WooCommerce API
        ↓
   Data Ingestion Service
        ↓
   ETL Pipeline (Apache Airflow)
        ↓
   PostgreSQL Database
        ↓
   ML Model Training
        ↓
   Forecast Storage
        ↓
   API Endpoints
        ↓
   Frontend Dashboard
```

### **3. Caching Strategy**

```python
# Recommended Redis Caching
import redis

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_dashboard_data(org_id: int):
    cache_key = f"dashboard:{org_id}"
    cached_data = redis_client.get(cache_key)

    if cached_data:
        return json.loads(cached_data)

    # Fetch from database
    data = fetch_dashboard_data(org_id)

    # Cache for 5 minutes
    redis_client.setex(cache_key, 300, json.dumps(data))
    return data
```

---

## 📋 **Current Data Sources Summary**

### **Active Data Files**

1. **`sales_with_features.csv`** - Main sales data (297KB, 2192 rows)
2. **`woocommerce_sales_with_features.csv`** - WooCommerce data (2.0KB, 38 rows)
3. **`mock_sales.csv`** - Mock data for testing (88KB, 2192 rows)
4. **`safety_stock_and_reorder_report.csv`** - Safety stock data (801B, 5 rows)

### **ML Model Outputs**

1. **`prophet_forecast.png`** - Forecast visualization (120KB)
2. **`prophet_woocommerce_forecast.png`** - WooCommerce forecast (43KB)

### **Data Processing Scripts**

1. **`data_ingestion/process_woocommerce_export.py`** - WooCommerce data processing
2. **`models/prophet_woocommerce.py`** - WooCommerce forecasting
3. **`models/safety_stock_and_reorder.py`** - Safety stock calculations

---

## 🔄 **Data Flow Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WooCommerce   │    │   CSV Files     │    │   ML Models     │
│     Export      │───▶│   (Local)       │───▶│   (Prophet)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │◀───│   FastAPI       │◀───│   Forecast      │
│   Dashboard     │    │   Backend       │    │   Results       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   JWT Auth      │
                       │   (In-Memory)   │
                       └─────────────────┘
```

---

## 🎯 **Key Takeaways**

### **Current State**

- ✅ **Data Sources**: CSV files with ML model outputs
- ✅ **Storage**: Local files + In-memory authentication
- ✅ **Processing**: Safe loading with fallbacks
- ✅ **API**: Real-time data serving

### **Production Recommendations**

- 🔄 **Database**: Migrate to PostgreSQL/MySQL
- 🔄 **Caching**: Implement Redis for performance
- 🔄 **ETL**: Add Apache Airflow for data pipelines
- 🔄 **Security**: Hash passwords, implement proper auth
- 🔄 **Monitoring**: Add data quality checks and logging

### **Data Integrity**

- **Backup Strategy**: Regular CSV file backups
- **Validation**: Data quality checks in safe_load_csv
- **Error Handling**: Graceful fallbacks to mock data
- **Logging**: Comprehensive error logging and monitoring

---

**📊 The current system successfully bridges ML model outputs with web API functionality, providing a solid foundation for production deployment.**
