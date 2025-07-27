#!/usr/bin/env python3
"""
Startup script for the WooCommerce Forecasting API
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "3001"))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    print(f"Starting WooCommerce Forecasting API on {host}:{port}")
    print(f"Debug mode: {debug}")
    
    # Run the FastAPI application
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    ) 