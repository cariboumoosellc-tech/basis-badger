// Example schema for Supabase/Postgres
// Table: leads
//
// CREATE TABLE leads (
//   id SERIAL PRIMARY KEY,
//   merchant_name VARCHAR(255) NOT NULL,
//   processor_name VARCHAR(255),
//   monthly_volume NUMERIC,
//   waste_amount NUMERIC,
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// Example Prisma schema
// model Lead {
//   id            Int      @id @default(autoincrement())
//   merchantName  String
//   processorName String?
//   monthlyVolume Float?
//   wasteAmount   Float?
//   createdAt     DateTime @default(now())
// }
