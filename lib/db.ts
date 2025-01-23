import { createPool } from "@vercel/postgres"
import { kv } from '@vercel/kv' // Importing Vercel KV

// Use Vercel Postgres for both development and production
export const db = createPool({
  connectionString: process.env.POSTGRES_URL,
})

// Function to set a key-value pair in Vercel KV
export async function setKeyValue(key: string, value: any) {
  await kv.set(key, value);
}

// Function to get a value by key from Vercel KV
export async function getValueByKey(key: string) {
  return await kv.get(key);
}

export async function query(text: string, params: any[]) {
  const client = await db.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } finally {
    client.release()
  }
}
