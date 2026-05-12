import sql from 'mssql';

const config: sql.config = {
  server: 'localhost',
  database: 'music',
  user: 'sa',
  password: 'your_password',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) return pool;
  pool = await sql.connect(config);
  return pool;
}

export { sql };
