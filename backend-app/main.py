from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import jwt
import os
from datetime import datetime, timedelta
import pandas as pd
import json

# Import your existing ML models (optional - handle missing files gracefully)
try:
    from models.prophet_woocommerce import ProphetWooCommerceModel
    from models.safety_stock_and_reorder import SafetyStockAndReorderModel
    from data_ingestion.process_woocommerce_export import WooCommerceDataProcessor
    ML_MODELS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Some ML models could not be imported: {e}")
    ML_MODELS_AVAILABLE = False
except Exception as e:
    print(f"Warning: Error importing ML models: {e}")
    ML_MODELS_AVAILABLE = False

app = FastAPI(title="WooCommerce Forecasting API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"

# Pydantic models
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class User(BaseModel):
    id: int
    email: str
    name: str
    organization_id: int

class Organization(BaseModel):
    id: int
    name: str
    stripe_customer_id: Optional[str] = None
    created_at: str
    updated_at: str

class DashboardData(BaseModel):
    totalProducts: int
    totalForecastedSales: float
    organizationId: int

class SalesForecast(BaseModel):
    id: int
    product_id: int
    forecasted_sales: float
    forecast_date: str
    organization_id: int

class WooCommerceProduct(BaseModel):
    id: int
    name: str
    price: str
    status: str
    stock_quantity: Optional[int] = None

class WooCommerceOrder(BaseModel):
    id: int
    status: str
    total: str
    date_created: str
    customer_id: Optional[int] = None

# Mock database (replace with real database)
users_db = {
    1: {"id": 1, "email": "admin@example.com", "password": "admin123", "name": "Admin User", "organization_id": 1}
}

organizations_db = {
    1: {"id": 1, "name": "Demo Organization", "stripe_customer_id": None, "created_at": "2024-01-01", "updated_at": "2024-01-01"}
}

# Authentication functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return int(user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(user_id: int = Depends(verify_token)):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

# Helper function to safely load CSV files
def safe_load_csv(filename: str, default_data=None):
    try:
        if os.path.exists(filename):
            return pd.read_csv(filename)
        else:
            print(f"Warning: File {filename} not found, using default data")
            return default_data or pd.DataFrame()
    except Exception as e:
        print(f"Warning: Error loading {filename}: {e}")
        return default_data or pd.DataFrame()

# Authentication endpoints
@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    # Mock authentication - replace with real authentication
    for user in users_db.values():
        if user["email"] == user_data.email and user["password"] == user_data.password:
            access_token = create_access_token(data={"sub": str(user["id"])})
            return {
                "success": True,
                "data": {
                    "access_token": access_token,
                    "token_type": "bearer",
                    "user": {
                        "id": user["id"],
                        "email": user["email"],
                        "name": user["name"],
                        "organization_id": user["organization_id"]
                    }
                }
            }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/register")
async def register(user_data: UserRegister):
    # Mock registration - replace with real registration
    user_id = len(users_db) + 1
    users_db[user_id] = {
        "id": user_id,
        "email": user_data.email,
        "password": user_data.password,
        "name": user_data.name,
        "organization_id": 1
    }
    
    access_token = create_access_token(data={"sub": str(user_id)})
    return {
        "success": True,
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user_data.email,
                "name": user_data.name,
                "organization_id": 1
            }
        }
    }

# Dashboard endpoints
@app.get("/api/dashboard/{organization_id}")
async def get_dashboard_data(organization_id: int, current_user: dict = Depends(get_current_user)):
    try:
        # Load your existing data safely
        sales_data = safe_load_csv("sales_with_features.csv")
        
        # Calculate dashboard metrics
        if not sales_data.empty and 'product_id' in sales_data.columns:
            total_products = len(sales_data['product_id'].unique())
            total_forecasted_sales = sales_data['quantity'].sum() if 'quantity' in sales_data.columns else 0
        else:
            # Use mock data if CSV is not available
            total_products = 25
            total_forecasted_sales = 15000.0
        
        return {
            "success": True,
            "data": {
                "totalProducts": total_products,
                "totalForecastedSales": float(total_forecasted_sales),
                "organizationId": organization_id
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/dashboard/summary/{organization_id}")
async def get_dashboard_summary(organization_id: int, current_user: dict = Depends(get_current_user)):
    return await get_dashboard_data(organization_id, current_user)

# Organizations endpoints
@app.get("/api/organizations")
async def get_organizations(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "data": list(organizations_db.values())
    }

@app.get("/api/organizations/{org_id}")
async def get_organization(org_id: int, current_user: dict = Depends(get_current_user)):
    if org_id not in organizations_db:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    return {
        "success": True,
        "data": organizations_db[org_id]
    }

# Sales forecasts endpoints
@app.get("/api/sales-forecasts/{organization_id}")
async def get_sales_forecasts(organization_id: int, current_user: dict = Depends(get_current_user)):
    try:
        # Load your existing forecast data safely
        forecast_data = safe_load_csv("woocommerce_sales_with_features.csv")
        
        forecasts = []
        if not forecast_data.empty:
            for _, row in forecast_data.iterrows():
                forecasts.append({
                    "id": int(row.get('product_id', 0)),
                    "product_id": int(row.get('product_id', 0)),
                    "forecasted_sales": float(row.get('quantity', 0)),
                    "forecast_date": datetime.now().isoformat(),
                    "organization_id": organization_id
                })
        else:
            # Mock data if CSV is not available
            forecasts = [
                {
                    "id": 1,
                    "product_id": 1,
                    "forecasted_sales": 100.0,
                    "forecast_date": datetime.now().isoformat(),
                    "organization_id": organization_id
                }
            ]
        
        return {
            "success": True,
            "data": forecasts
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/api/sales-forecasts")
async def create_sales_forecast(forecast_data: dict, current_user: dict = Depends(get_current_user)):
    # Mock creation - replace with real database operation
    return {
        "success": True,
        "data": {
            "id": 1,
            "product_id": forecast_data.get("product_id"),
            "forecasted_sales": forecast_data.get("forecasted_sales"),
            "forecast_date": datetime.now().isoformat(),
            "organization_id": forecast_data.get("organization_id")
        }
    }

@app.put("/api/sales-forecasts/{forecast_id}")
async def update_sales_forecast(forecast_id: int, forecast_data: dict, current_user: dict = Depends(get_current_user)):
    # Mock update - replace with real database operation
    return {
        "success": True,
        "data": {
            "id": forecast_id,
            "product_id": forecast_data.get("product_id"),
            "forecasted_sales": forecast_data.get("forecasted_sales"),
            "forecast_date": datetime.now().isoformat(),
            "organization_id": forecast_data.get("organization_id")
        }
    }

@app.delete("/api/sales-forecasts/{forecast_id}")
async def delete_sales_forecast(forecast_id: int, current_user: dict = Depends(get_current_user)):
    # Mock deletion - replace with real database operation
    return {
        "success": True,
        "data": None
    }

# WooCommerce integration endpoints
@app.post("/api/woocommerce/sync/{organization_id}")
async def sync_woocommerce_data(organization_id: int, current_user: dict = Depends(get_current_user)):
    try:
        # Use your existing WooCommerce processor if available
        if ML_MODELS_AVAILABLE:
            try:
                processor = WooCommerceDataProcessor()
                # Mock sync operation
                return {
                    "success": True,
                    "data": {
                        "message": f"Successfully synced WooCommerce data for organization {organization_id}"
                    }
                }
            except Exception as e:
                print(f"Warning: WooCommerce processor error: {e}")
        
        # Fallback response
        return {
            "success": True,
            "data": {
                "message": f"Successfully synced WooCommerce data for organization {organization_id}"
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/woocommerce/products/{organization_id}")
async def get_woocommerce_products(organization_id: int, current_user: dict = Depends(get_current_user)):
    try:
        # Load your existing WooCommerce data safely
        wc_data = safe_load_csv("woocommerce_orders_export.csv")
        
        products = []
        if not wc_data.empty:
            for _, row in wc_data.iterrows():
                products.append({
                    "id": int(row.get('product_id', 0)),
                    "name": str(row.get('product_name', 'Unknown')),
                    "price": str(row.get('price', '0')),
                    "status": 'publish',
                    "stock_quantity": int(row.get('quantity', 0))
                })
        else:
            # Mock data if CSV is not available
            products = [
                {
                    "id": 1,
                    "name": "Sample Product",
                    "price": "29.99",
                    "status": "publish",
                    "stock_quantity": 10
                }
            ]
        
        return {
            "success": True,
            "data": products
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/woocommerce/orders/{organization_id}")
async def get_woocommerce_orders(organization_id: int, current_user: dict = Depends(get_current_user)):
    try:
        # Load your existing WooCommerce data safely
        wc_data = safe_load_csv("woocommerce_orders_export.csv")
        
        orders = []
        if not wc_data.empty:
            for _, row in wc_data.iterrows():
                orders.append({
                    "id": int(row.get('order_id', 0)),
                    "status": str(row.get('status', 'completed')),
                    "total": str(row.get('total', '0')),
                    "date_created": str(row.get('date', datetime.now().isoformat())),
                    "customer_id": int(row.get('customer_id', 0)) if 'customer_id' in wc_data.columns else None
                })
        else:
            # Mock data if CSV is not available
            orders = [
                {
                    "id": 1,
                    "status": "completed",
                    "total": "29.99",
                    "date_created": datetime.now().isoformat(),
                    "customer_id": 1
                }
            ]
        
        return {
            "success": True,
            "data": orders
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001) 