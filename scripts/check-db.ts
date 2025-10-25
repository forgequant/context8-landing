import { db } from "../lib/db/index.js"
import { sql } from "drizzle-orm"

async function checkTables() {
  try {
    const tables = await db.execute(sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `)

    console.log("📊 Таблицы в базе данных:")
    tables.rows.forEach((row: any) => console.log("  -", row.tablename))

    if (tables.rows.length === 0) {
      console.log("\n❌ Таблицы не найдены! Нужно запустить миграции.")
      console.log("\nКоманда:")
      console.log('  DATABASE_URL="postgresql://context8:dev_password_123@localhost:5433/context8_dev" npx tsx lib/db/migrate.ts')
    } else {
      console.log(`\n✅ Найдено ${tables.rows.length} таблиц`)
    }

    process.exit(0)
  } catch (error) {
    console.error("❌ Ошибка подключения к базе данных:")
    console.error(error)
    process.exit(1)
  }
}

checkTables()
