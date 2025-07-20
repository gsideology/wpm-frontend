import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { organizations, salesForecasts } from '../../../../lib/schema';

export async function GET() {
  try {
    // Test querying organizations
    const orgs = await db.select().from(organizations);
    
    // Test querying sales forecasts
    const forecasts = await db.select().from(salesForecasts);
    
    return NextResponse.json({
      success: true,
      message: 'Database integration working!',
      data: {
        organizations: orgs,
        salesForecasts: forecasts,
        counts: {
          organizations: orgs.length,
          salesForecasts: forecasts.length
        }
      }
    });
  } catch (error) {
    console.error('Database API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 