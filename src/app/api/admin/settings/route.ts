import { NextRequest, NextResponse } from 'next/server';
import { settingsServerService } from '@/services/server/settings.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await settingsServerService.getAllSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const oldSettings = await settingsServerService.getAllSettings();
    const updated = await settingsServerService.updateBulkSettings(body);

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'settings',
      old_value: oldSettings,
      new_value: updated
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
