import 'server-only'
import mysql from 'mysql2/promise'

declare global {
  var __dbPool: mysql.Pool | undefined
  var __dbPoolInitialized: boolean | undefined
}

let poolInitLock: Promise<void> | null = null

async function getPool(): Promise<mysql.Pool> {
  if (global.__dbPool && global.__dbPoolInitialized) {
    return global.__dbPool
  }

  if (poolInitLock) {
    await poolInitLock
    return global.__dbPool!
  }

  if (global.__dbPool && !global.__dbPoolInitialized) {
    try {
      await global.__dbPool.end().catch(() => {})
    } catch (e) {}
    global.__dbPool = undefined
  }

  poolInitLock = (async () => {
    global.__dbPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 100,
      connectTimeout: 10000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      timezone: '+08:00',
      dateStrings: true,
    })
    global.__dbPoolInitialized = true
  })()

  await poolInitLock
  poolInitLock = null
  
  return global.__dbPool!
}

export async function query(sql: string, params?: any[]) {
  const pool = await getPool()
  let connection: mysql.PoolConnection | null = null
  
  try {
    connection = await pool.getConnection()
    const [results] = await connection.execute(sql, params || [])
    return results
  } catch (error: any) {
    console.error('[DB Query Error]', error?.message)
    throw error
  } finally {
    if (connection) {
      try {
        connection.release()
      } catch (e) {}
    }
  }
}
