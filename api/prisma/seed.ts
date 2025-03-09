import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.create({
    data: {
      email: "user@email.com",
      password: "user123",
      name: "test_user",
      role: "OWNER",
    },
  });

  const org = await prisma.organisation.create({
    data: {
      name: "Test Org",
      users: {
        connect: { id: owner.id },
      },
    },
  });

  const site1 = await prisma.site.create({
    data: {
      name: "test_site_1",
      organisation: {
        connect: { id: org.id },
      },
    },
  });

  const site2 = await prisma.site.create({
    data: {
      name: "test_site_2",
      organisation: {
        connect: { id: org.id },
      },
    },
  });

  for (let i = 0; i < 100; i++) {
    const item = await prisma.catalogueItem.create({
      data: {
        name: `Item ${i}`,
        description: "Test Item",
        SKU: `SKU_${i}`,
        category: "TESTING ITEM",
        organisation: {
          connect: { id: org.id },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
