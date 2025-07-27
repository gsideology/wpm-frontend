# WooCommerce Forecasting System - Full Stack Integration

This project integrates a FastAPI backend with authentication and a Next.js frontend for WooCommerce sales forecasting and inventory management.

## 🏗️ Architecture

- **Backend**: FastAPI with JWT authentication, ML models integration
- **Frontend**: Next.js with TypeScript, Tailwind CSS, authentication context
- **Database**: Currently using mock data (can be extended to PostgreSQL/MySQL)
- **Authentication**: JWT tokens with localStorage persistence

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd temp_project/backend-app
   ```

2. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables (optional):**

   ```bash
   # Create .env file
   echo "SECRET_KEY=your-secret-key-here" > .env
   echo "DEBUG=True" >> .env
   echo "HOST=0.0.0.0" >> .env
   echo "PORT=3001" >> .env
   ```

4. **Start the backend server:**

   ```bash
   python start.py
   ```

   Or directly with uvicorn:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port 3001 --reload
   ```

   The API will be available at: `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd temp_project/frontend-app
   ```

2. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

3. **Set environment variables (optional):**

   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   ```

4. **Start the frontend development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:3000`

## 🔐 Authentication

### Default Credentials

The system comes with a default admin user:

- **Email**: `admin@example.com`
- **Password**: `admin123`

### Authentication Flow

1. **Login**: Users can log in with email/password
2. **Registration**: New users can register with name, email, and password
3. **Token Management**: JWT tokens are automatically managed in localStorage
4. **Protected Routes**: Dashboard and other sensitive pages require authentication
5. **Logout**: Users can logout, which clears the token and redirects to login

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Dashboard

- `GET /api/dashboard/{organization_id}` - Get dashboard data
- `GET /api/dashboard/summary/{organization_id}` - Get dashboard summary

### Organizations

- `GET /api/organizations` - List organizations
- `GET /api/organizations/{id}` - Get organization details

### Sales Forecasts

- `GET /api/sales-forecasts/{organization_id}` - Get sales forecasts
- `POST /api/sales-forecasts` - Create sales forecast
- `PUT /api/sales-forecasts/{id}` - Update sales forecast
- `DELETE /api/sales-forecasts/{id}` - Delete sales forecast

### WooCommerce Integration

- `POST /api/woocommerce/sync/{organization_id}` - Sync WooCommerce data
- `GET /api/woocommerce/products/{organization_id}` - Get WooCommerce products
- `GET /api/woocommerce/orders/{organization_id}` - Get WooCommerce orders

## 🎯 Features

### Frontend Features

- **Responsive Dashboard**: Modern UI with dark theme
- **Authentication**: Login/register forms with validation
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Real-time Data**: Live dashboard with refresh capabilities
- **WooCommerce Sync**: One-click WooCommerce data synchronization
- **User Management**: Display user information and logout functionality

### Backend Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Cross-origin resource sharing enabled
- **ML Integration**: Connects to existing Prophet and forecasting models
- **Data Processing**: Handles WooCommerce data processing
- **Error Handling**: Comprehensive error responses
- **API Documentation**: Auto-generated with FastAPI

## 🔧 Configuration

### Backend Configuration

Environment variables in `.env`:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
HOST=0.0.0.0
PORT=3001
```

### Frontend Configuration

Environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📁 Project Structure

```
temp_project/
├── backend-app/
│   ├── main.py                 # FastAPI application
│   ├── start.py                # Startup script
│   ├── requirements.txt        # Python dependencies
│   ├── models/                 # ML models
│   ├── data_ingestion/         # Data processing
│   └── feature_engineering/    # Feature engineering
└── frontend-app/
    ├── src/
    │   ├── app/
    │   │   ├── login/          # Login page
    │   │   ├── dashboard/      # Dashboard page
    │   │   └── providers.tsx   # Context providers
    │   ├── components/
    │   │   └── ProtectedRoute.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── hooks/              # Custom hooks
    │   └── lib/
    │       └── api.ts          # API service
    └── package.json
```

## 🚨 Security Notes

- **Development Only**: This setup uses mock authentication for development
- **Production Ready**: For production, implement proper password hashing and database storage
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit sensitive data to version control

## 🔄 Development Workflow

1. **Start Backend**: Run `python start.py` in backend directory
2. **Start Frontend**: Run `npm run dev` in frontend directory
3. **Access Application**: Navigate to `http://localhost:3000`
4. **Login**: Use default credentials or register new account
5. **Test Features**: Explore dashboard, sync WooCommerce data, etc.

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Error**:

   - Ensure backend is running on port 3001
   - Check CORS settings in `main.py`
   - Verify `NEXT_PUBLIC_API_URL` environment variable

2. **Authentication Issues**:

   - Clear browser localStorage
   - Check JWT token expiration (30 minutes default)
   - Verify SECRET_KEY is set

3. **Data Loading Issues**:
   - Ensure CSV files exist in backend directory
   - Check file permissions
   - Verify data format matches expected schema

### Logs

- **Backend**: Check console output for FastAPI logs
- **Frontend**: Check browser console for errors
- **Network**: Use browser dev tools to inspect API calls

## 🔮 Next Steps

1. **Database Integration**: Replace mock data with real database
2. **User Management**: Add user roles and permissions
3. **Real-time Updates**: Implement WebSocket connections
4. **Advanced ML**: Integrate more sophisticated forecasting models
5. **Production Deployment**: Set up proper deployment pipeline

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the API documentation at `http://localhost:3001/docs`
3. Check browser console and backend logs for errors
