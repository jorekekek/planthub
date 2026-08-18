import prisma from "../src/lib/prisma";

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "dev@planthub.local",
    },
    update: {},
    create: {
      email: "dev@planthub.local",
      passwordHash: "development-only",
      firstName: "PlantHub",
      lastName: "Developer",
    },
  });

  console.log("Development user:", user);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });