# Backend Integration Guide

This document explains how the frontend integrates with the backend API from [gsideology/wpm](https://github.com/gsideology/wpm).

## Architecture Overview

```
Frontend (Next.js) ←→ Backend API (gsideology/wpm) ←→ Database
```

## Environment Configuration

### Required Environment Variables

```env
# Database connection (for direct queries - fallback)
DATABASE_URL=postgresql://user:password@host:port/database

# Backend API connection
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API Service Layer

The frontend uses a centralized API service (`src/lib/api.ts`) that provides:

### Core Features

- **Type-safe API calls** with TypeScript interfaces
- **Error handling** with consistent response format
- **Request/response interceptors** for logging and debugging
- **Automatic retry logic** for failed requests

### Available Endpoints

#### Dashboard

- `GET /api/dashboard/{organizationId}` - Get dashboard data
- `GET /api/dashboard/summary/{organizationId}` - Get dashboard summary

#### Organizations

- `GET /api/organizations` - List all organizations
- `GET /api/organizations/{id}` - Get specific organization

#### Sales Forecasts

- `GET /api/sales-forecasts/{organizationId}` - Get forecasts for organization
- `POST /api/sales-forecasts` - Create new forecast
- `PUT /api/sales-forecasts/{id}` - Update forecast
- `DELETE /api/sales-forecasts/{id}` - Delete forecast

#### WooCommerce Integration

- `POST /api/woocommerce/sync/{organizationId}` - Sync WooCommerce data
- `GET /api/woocommerce/products/{organizationId}` - Get WooCommerce products
- `GET /api/woocommerce/orders/{organizationId}` - Get WooCommerce orders

## React Hooks

### useBackendDashboard

```typescript
const {
  data,
  isLoading,
  error,
  refresh,
  isRefreshing,
  syncWooCommerce,
  isSyncing,
} = useBackendDashboard();
```

**Features:**

- Automatic data fetching with TanStack Query
- Manual refresh functionality
- WooCommerce sync integration
- Loading and error states
- Optimistic updates

## Migration from Direct Database Queries

### Before (Direct Database)

```typescript
// Old approach - direct database queries
const data = await db
  .select()
  .from(dashboardSummary)
  .where(eq(dashboardSummary.organizationId, orgId));
```

### After (Backend API)

```typescript
// New approach - backend API
const response = await apiService.getDashboardSummary(orgId);
if (response.success && response.data) {
  return response.data;
}
```

## Testing Backend Integration

### 1. Test API Connection

Visit: `http://localhost:3000/api/test-backend`

This endpoint tests:

- Backend API connectivity
- Dashboard data retrieval
- Organization data retrieval
- Environment configuration

### 2. Test Dashboard

Visit: `http://localhost:3000/dashboard`

The dashboard now:

- Uses backend API for data
- Shows connection status
- Provides sync functionality
- Handles errors gracefully

## Error Handling

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Error Scenarios

1. **Network Errors** - Connection timeouts, CORS issues
2. **API Errors** - 4xx/5xx status codes
3. **Data Errors** - Invalid response format
4. **Authentication Errors** - Missing/invalid tokens

### Error Recovery

- Automatic retry for network errors
- User-friendly error messages
- Retry buttons for manual recovery
- Fallback to cached data when available

## Development Workflow

### 1. Start Backend

```bash
# Clone and start the backend
git clone https://github.com/gsideology/wpm
cd wpm
npm install
npm run dev
```

### 2. Start Frontend

```bash
# In the frontend directory
npm run dev
```

### 3. Test Integration

- Visit `http://localhost:3000`
- Click "Test Backend API"
- Check dashboard functionality

## Production Deployment

### Environment Variables

```env
# Production backend URL
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### CORS Configuration

Ensure the backend allows requests from your frontend domain:

```typescript
// Backend CORS configuration
app.use(
  cors({
    origin: ["https://your-frontend-domain.com"],
    credentials: true,
  })
);
```

## Monitoring and Debugging

### API Logging

All API calls are logged to the browser console with:

- Request details (URL, method, headers)
- Response data or errors
- Timing information

### Network Tab

Use browser DevTools Network tab to:

- Monitor API requests
- Check response times
- Debug CORS issues
- Verify request/response format

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check backend CORS configuration
   - Verify frontend URL is allowed

2. **Connection Timeouts**

   - Check backend is running
   - Verify `NEXT_PUBLIC_API_URL` is correct

3. **Authentication Issues**

   - Implement proper auth flow
   - Add authorization headers

4. **Data Mismatch**
   - Check API response format
   - Verify TypeScript interfaces

### Debug Commands

```bash
# Test backend connectivity
curl http://localhost:3001/api/health

# Check environment variables
echo $NEXT_PUBLIC_API_URL

# View API logs
npm run dev 2>&1 | grep "API"
```

## Next Steps

1. **Implement Authentication** - Add proper auth flow with Better Auth
2. **Add Real-time Updates** - Implement WebSocket connections
3. **Optimize Performance** - Add request caching and optimization
4. **Add Error Boundaries** - Implement React error boundaries
5. **Add Tests** - Create unit and integration tests
