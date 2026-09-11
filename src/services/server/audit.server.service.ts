import { query } from '@/lib/db';

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
    const res = await query<AuditLogRecord>(`
      INSERT INTO public.audit_logs (
        admin_id, admin_name, action, module, record_id, old_value, new_value, ip_address, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW()
      )
      RETURNING *;
    `, [
      data.admin_id || null,
      data.admin_name || 'Admin',
      data.action,
      data.module,
      data.record_id || null,
      JSON.stringify(data.old_value || {}),
      JSON.stringify(data.new_value || {}),
      data.ip_address || null
    ]);

    return res.rows[0];
  },

  async getAuditLogs(module?: string, limit = 50): Promise<AuditLogRecord[]> {
    let sql = `SELECT * FROM public.audit_logs`;
    const params: any[] = [];

    if (module) {
      sql += ` WHERE module = $1`;
      params.push(module);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1};`;
    params.push(limit);

    const res = await query<AuditLogRecord>(sql, params);
    return res.rows;
  }
};
