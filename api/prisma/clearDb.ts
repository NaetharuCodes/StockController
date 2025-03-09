import { PrismaClient } from "@prisma/client";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });
const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("This script will clear all data from your database.");
  const answer = prompt("Are you sure you want to proceed? (y/n): ");

  if (answer.toLowerCase() !== "y") {
    console.log("Database clearing cancelled.");
    return;
  }

  console.log("Cleaning database...");
  await prisma.stockTransfer.deleteMany();
  await prisma.stockAudit.deleteMany();
  await prisma.siteStock.deleteMany();
  await prisma.subCatalogueItem.deleteMany();
  await prisma.catalogueItem.deleteMany();
  await prisma.site.deleteMany();
  await prisma.subCatalogue.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organisation.deleteMany();
  console.log("Database cleaned successfully.");
}

clearDatabase()
  .catch((e) => {
    console.error("Error clearing database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
