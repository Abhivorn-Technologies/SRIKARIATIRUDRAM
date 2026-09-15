import { connectToDatabase } from '@/lib/mongodb';

export interface AuditLogRecord {
  id: string;
  admin_id?: string;
  admin_name: string;
  action: string;
  module: string;
  record_id?: string;
  old_value?: any;
  new_value?: any;
  ip_address?: string;
  created_at: string;
}

export const auditServerService = {
  async logAction(data: {
    admin_id?: string;
    admin_name: string;
    action: string;
    module: string;
    record_id?: string;
    old_value?: any;
    new_value?: any;
    ip_address?: string;
  }): Promise<AuditLogRecord> {
    const { db } = await connectToDatabase();
    const logId = 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newLog: AuditLogRecord = {
      id: logId,
      admin_id: data.admin_id || undefined,
      admin_name: data.admin_name || 'Admin',
      action: data.action,
      module: data.module,
      record_id: data.record_id || undefined,
      old_value: data.old_value || {},
      new_value: data.new_value || {},
      ip_address: data.ip_address || undefined,
      created_at: new Date().toISOString()
    };

    await db.collection('audit_logs').insertOne(newLog as any);
    return newLog;
  },

  async getAuditLogs(module?: string, limit = 50): Promise<AuditLogRecord[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (module) filter.module = module;

    const docs = await db.collection('audit_logs')
      .find(filter)
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || doc._id.toString()
    }));
  }
};
