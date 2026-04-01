import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const url = new URL(process.env.DATABASE_URL!);
url.searchParams.set("connect_timeout", "120");
url.searchParams.set("statement_timeout", "120000");
url.searchParams.set("idle_in_transaction_session_timeout", "300000");
const adapter = new PrismaPg({ connectionString: url.toString() });
const prisma = new PrismaClient({ adapter });

const IS_REMOTE = url.hostname.includes("neon.tech") || url.hostname.includes("pooler");

async function main() {
  console.log(`🌱 Seeding database... (${IS_REMOTE ? "remote" : "local"})`);

  // ここにシードデータを追加
  // 例:
  // await prisma.user.upsert({
  //   where: { email: "admin@example.com" },
  //   update: {},
  //   create: { email: "admin@example.com", name: "Admin" },
  // });

  console.log("✅ Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
