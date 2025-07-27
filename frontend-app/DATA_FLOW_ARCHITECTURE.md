# Data Flow Architecture

This document explains how data flows through the WPM Frontend Application, from the React UI down to the PostgreSQL database.

## Overview

The application uses a modern, layered architecture that separates concerns and provides excellent performance through caching and pre-computed database views.

## Data Flow Schema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │    │  TanStack Query  │    │  Server Actions │
│   (Dashboard)   │◄──►│   (useQuery)     │◄──►│  (getDashboard) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   API Service    │    │   Mock Data     │
                       │   (api.ts)       │◄──►│   (mock-data.ts)│
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Backend API     │
                       │  (gsideology/wpm)│
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Database       │
                       │   (PostgreSQL)   │
                       │   ┌─────────────┐│
                       │   │Materialized ││
                       │   │View         ││
                       │   └─────────────┘│
                       └──────────────────┘
```

## Step-by-Step Data Flow

### 1. **User Interaction**

```
User visits /dashboard or clicks refresh button
```

### 2. **React Component**

```typescript
// app/dashboard/page.tsx
const { data, isLoading, error } = useBackendDashboard();
```

### 3. **TanStack Query Hook**

```typescript
// hooks/use-backend-dashboard.ts
const { data, isLoading, error } = useQuery({
  queryKey: ["backend-dashboard", orgId],
  queryFn: async () => {
    const response = await mockApiService.getDashboardSummary(orgId);
    return response.data;
  },
  enabled: !!orgId,
});
```

### 4. **API Service Layer**

```typescript
// lib/api.ts OR lib/mock-data.ts
async getDashboardSummary(orgId: number) {
  // Makes HTTP request to backend API
  return this.request<DashboardData>(`/api/dashboard/summary/${orgId}`);
}
```

### 5. **Backend API** (External)

```
GET http://localhost:3001/api/dashboard/summary/1
```

### 6. **Database Query** (Backend)

```sql
-- Backend queries the materialized view
SELECT * FROM dashboard_summary WHERE organization_id = 1;
```

### 7. **Materialized View**

```sql
-- Pre-computed aggregation in PostgreSQL
CREATE MATERIALIZED VIEW dashboard_summary AS
SELECT
  organization_id,
  COUNT(DISTINCT product_id) as total_products,
  SUM(forecasted_sales) as total_forecasted_sales
FROM sales_forecasts
GROUP BY organization_id;
```

## Data Types Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   DashboardData │    │   ApiResponse    │    │   Database Row  │
│   Interface     │◄──►│   Wrapper        │◄──►│   (JSON)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Type Definitions

```typescript
// What the UI receives
interface DashboardData {
  totalProducts: number; // 156
  totalForecastedSales: number; // 45280.50
  organizationId: number; // 1
}

// What the API returns
interface ApiResponse<T> {
  success: boolean; // true
  data?: T; // DashboardData
  error?: string; // undefined
}
```

## Caching Strategy

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   First Load    │───►│   Cache Miss     │───►│   API Call      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Store in Cache │
                       │   (TanStack)     │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Subsequent     │───►│   Cache Hit     │
                       │   Loads          │    │   (Instant)     │
                       └──────────────────┘    └─────────────────┘
```

## Key Components

### 1. **React UI Layer**

- **File**: `app/dashboard/page.tsx`
- **Purpose**: User interface and interaction
- **Features**: Loading states, error handling, data display

### 2. **TanStack Query Layer**

- **File**: `hooks/use-backend-dashboard.ts`
- **Purpose**: Client-side state management and caching
- **Features**: Automatic caching, background refetching, optimistic updates

### 3. **API Service Layer**

- **File**: `lib/api.ts` (production) / `lib/mock-data.ts` (development)
- **Purpose**: HTTP communication with backend
- **Features**: Type-safe API calls, error handling, request/response interceptors

### 4. **Server Actions Layer**

- **File**: `app/actions/dashboard-actions.ts`
- **Purpose**: Server-side data fetching (Next.js feature)
- **Features**: Server-side execution, security, type safety

### 5. **Database Layer**

- **File**: `lib/schema.ts`
- **Purpose**: Data storage and retrieval
- **Features**: Materialized views, multi-tenant isolation, optimized queries

## Example Data Journey

```
1. User clicks "Refresh Dashboard"
2. TanStack Query calls mockApiService.getDashboardSummary(1)
3. Mock service returns: { success: true, data: { totalProducts: 156, ... } }
4. TanStack Query updates cache with new data
5. React component re-renders with fresh data
6. User sees updated dashboard instantly
```

## Multi-Tenant Architecture

The application supports multiple organizations (tenants) through:

### 1. **Organization Isolation**

```typescript
// Each query includes organization ID
queryKey: ["backend-dashboard", orgId];
```

### 2. **Database Filtering**

```sql
-- Materialized view includes organization_id
SELECT * FROM dashboard_summary WHERE organization_id = ?
```

### 3. **Cache Separation**

```typescript
// Different cache keys for different organizations
["backend-dashboard", 1][("backend-dashboard", 2)]; // Organization 1 // Organization 2
```

## Performance Optimizations

### 1. **Materialized Views**

- Pre-computed aggregations at database level
- Reduces query execution time
- Updated periodically with `REFRESH MATERIALIZED VIEW`

### 2. **TanStack Query Caching**

- Client-side caching prevents unnecessary API calls
- Background refetching keeps data fresh
- Stale-while-revalidate pattern

### 3. **Type Safety**

- Full TypeScript support throughout the stack
- Compile-time error detection
- Better developer experience

## Error Handling

### 1. **API Level**

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 2. **Query Level**

```typescript
const { data, isLoading, error } = useQuery({
  // Error handling built into TanStack Query
});
```

### 3. **UI Level**

```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

## Development vs Production

### Development Mode

- Uses `mockApiService` from `lib/mock-data.ts`
- Simulated API responses
- No external backend required

### Production Mode

- Uses `apiService` from `lib/api.ts`
- Real HTTP requests to backend
- External backend API required

## Benefits of This Architecture

### 1. **Performance**

- **Materialized View**: Pre-computed aggregations
- **TanStack Cache**: Instant UI updates
- **Type Safety**: Full TypeScript support

### 2. **Scalability**

- **Multi-tenant**: Each organization has isolated data
- **Caching**: Reduces database load
- **Background sync**: Fresh data without blocking UI

### 3. **Developer Experience**

- **Mock Data**: Development without backend
- **Error Handling**: Graceful fallbacks
- **Loading States**: Built-in UX patterns

### 4. **Maintainability**

- **Separation of Concerns**: Each layer has a specific responsibility
- **Type Safety**: Compile-time error detection
- **Modular Design**: Easy to test and modify individual components

## Best Practices

### 1. **Query Keys**

- Include organization ID for multi-tenant isolation
- Use descriptive, hierarchical keys
- Keep keys consistent across the application

### 2. **Error Handling**

- Handle errors at multiple levels
- Provide user-friendly error messages
- Implement retry mechanisms

### 3. **Caching Strategy**

- Set appropriate cache times
- Invalidate cache when data changes
- Use optimistic updates for better UX

### 4. **Type Safety**

- Define interfaces for all data structures
- Use TypeScript throughout the stack
- Validate API responses

## Future Enhancements

### 1. **Real-time Updates**

- WebSocket integration for live data
- Server-sent events for real-time notifications

### 2. **Advanced Caching**

- Redis for server-side caching
- CDN for static assets

### 3. **Performance Monitoring**

- Query performance metrics
- Cache hit/miss ratios
- API response times

### 4. **Offline Support**

- Service worker for offline functionality
- Local storage for offline data

This architecture provides a solid foundation for a scalable, performant, and maintainable multi-tenant application.
