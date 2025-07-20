import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

// Create the connection
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function testDatabase() {
  try {
    console.log("🔌 Testing database connection...");

    // Test basic connection
    const result = await client`SELECT version()`;
    console.log("✅ Database connection successful");
    console.log("PostgreSQL version:", result[0].version);

    // Test inserting data into organizations
    console.log("\n📝 Testing data insertion...");
    const insertResult = await client`
      INSERT INTO organizations (name, stripe_customer_id) 
      VALUES ('Test Company', 'cus_test123')
      RETURNING id, name
    `;
    console.log("✅ Inserted organization:", insertResult[0]);

    // Test querying data
    console.log("\n🔍 Testing data querying...");
    const orgs = await client`SELECT * FROM organizations`;
    console.log("✅ Found organizations:", orgs);

    // Test inserting sales forecast
    console.log("\n📊 Testing sales forecast insertion...");
    const forecastResult = await client`
      INSERT INTO sales_forecasts (product_id, forecasted_sales, organization_id) 
      VALUES (1, 1000, ${insertResult[0].id})
      RETURNING id, product_id, forecasted_sales, organization_id
    `;
    console.log("✅ Inserted sales forecast:", forecastResult[0]);

    // Test querying sales forecasts
    const forecasts = await client`SELECT * FROM sales_forecasts`;
    console.log("✅ Found sales forecasts:", forecasts);

    console.log("\n🎉 All database tests passed!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    await client.end();
  }
}

testDatabase();
