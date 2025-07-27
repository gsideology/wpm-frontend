import { NextResponse } from 'next/server';
import { apiService } from '../../../lib/api';

export async function GET() {
  try {
    const orgId = 1; // Mock organization ID
    
    // Test backend API endpoints
    const dashboardResponse = await apiService.getDashboardSummary(orgId);
    const organizationsResponse = await apiService.getOrganizations();
    
    return NextResponse.json({
      success: true,
      message: 'Backend API integration test',
      data: {
        dashboard: dashboardResponse,
        organizations: organizationsResponse,
        apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Backend API test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Backend API connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      },
      { status: 500 }
    );
  }
} 