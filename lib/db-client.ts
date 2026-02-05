import { initDb } from './db'
import type { ResultSetHeader, RowDataPacket, FieldPacket } from 'mysql2'

export async function query<T = RowDataPacket>(sql: string, params: any[] = []): Promise<T[]> {
  const pool = await initDb()
  const [rows] = (await pool.execute(sql, params)) as unknown as [T[], FieldPacket[]]
  return rows
}

export async function exec(sql: string, params: any[] = []) {
  const pool = await initDb()
  const [res] = (await pool.execute<ResultSetHeader>(sql, params)) as [ResultSetHeader, FieldPacket[]]
  return res
}
