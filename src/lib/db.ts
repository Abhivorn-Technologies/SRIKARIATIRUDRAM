import { Pool } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Global singleton for PostgreSQL connection pool in Next.js
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var _supabaseAdmin: SupabaseClient | undefined;
}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

export function getPool(): Pool {
  if (!connectionString) {
    throw new Error('Database connection string (DIRECT_URL or DATABASE_URL) is not configured.');
  }

  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  return global._pgPool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
  const pool = getPool();
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development' && duration > 500) {
    console.warn(`[Slow Query ${duration}ms]: ${text.slice(0, 100)}`);
  }
  return { rows: res.rows, rowCount: res.rowCount || 0 };
}

// Supabase Admin Client using Service Role Key (bypasses RLS on server-side APIs)
export function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is missing.');
  }

  if (!global._supabaseAdmin) {
    global._supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  return global._supabaseAdmin;
}
