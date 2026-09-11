import { NextResponse } from 'next/server';
import { dashboardServerService } from '@/services/server/dashboard.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await dashboardServerService.getDashboardMetrics();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in /api/admin/dashboard:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
