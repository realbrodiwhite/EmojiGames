/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponents: true,
  },
  env: {
    DATABASE_URL=postgres://default:uxJEC6VSXDc4@ep-broad-snowflake-a4u52mda-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require
    DATABASE_URL_UNPOOLED=postgresql://default:uxJEC6VSXDc4@ep-broad-snowflake-a4u52mda.us-east-1.aws.neon.tech/verceldb?sslmode=require
    PGHOST=ep-broad-snowflake-a4u52mda-pooler.us-east-1.aws.neon.tech
    PGHOST_UNPOOLED=ep-broad-snowflake-a4u52mda.us-east-1.aws.neon.tech
    PGUSER=default
    PGDATABASE=verceldb
    PGPASSWORD=uxJEC6VSXDc4
    POSTGRES_URL=postgres://default:uxJEC6VSXDc4@ep-broad-snowflake-a4u52mda-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require
    POSTGRES_URL_NON_POOLING=postgres://default:uxJEC6VSXDc4@ep-broad-snowflake-a4u52mda.us-east-1.aws.neon.tech/verceldb?sslmode=require
    POSTGRES_USER=default
    POSTGRES_HOST=ep-broad-snowflake-a4u52mda-pooler.us-east-1.aws.neon.tech
    POSTGRES_PASSWORD=uxJEC6VSXDc4
    POSTGRES_DATABASE=verceldb
    POSTGRES_URL_NO_SSL=postgres://default:uxJEC6VSXDc4@ep-broad-snowflake-a4u52mda-pooler.us-east-1.aws.neon.tech/verceldb
    POSTGRES_PRISMA_URL=postgres://default:uxJEC6VSXDc4@ep-broad-snowflake-a4u52mda-pooler.us-east-1.aws.neon.tech/verceldb?pgbouncer=true&connect_timeout=15&sslmode=require
    EDGE_CONFIG=547a3d31-094c-4897-9782-4875e3c45013
    BLOB_READ_WRITE_TOKEN=vercel_blob_rw_DnpzYWAWIPZGolVN_cz2kznbwyEM1TTIUGaW5RV3HKke4OA
    KV_URL=rediss://default:Aax7AAIjcDEyNmIxYTY0NDIzODc0NDU0YjZjODBhNDc2NWYzMzJhNXAxMA@touching-prawn-44155.upstash.io:6379
    KV_REST_API_READ_ONLY_TOKEN=Aqx7AAIgcDHKPMcaVqYTjw6g2Ubeb7fyXDX-Jm9xYiUE0tLgonWRnA
    KV_REST_API_TOKEN=Aax7AAIjcDEyNmIxYTY0NDIzODc0NDU0YjZjODBhNDc2NWYzMzJhNXAxMA
    KV_REST_API_URL=https://touching-prawn-44155.upstash.io
  },
}

module.exports = nextConfig

