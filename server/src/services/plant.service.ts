import prisma from "../lib/prisma";

export async function getPlants(userId: number) {
  return prisma.plant.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPlantById(id: number, userId: number) {
  return prisma.plant.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function createPlant(data: {
  userId: number;
  name: string;
  species?: string;
  description?: string;
  location?: string;
  sunlight?: string;
  wateringFrequency?: number;
  imageUrl?: string;
}) {
  return prisma.plant.create({
    data,
  });
}

export async function updatePlant(
  id: number,
  userId: number,
  data: {
    name?: string;
    species?: string;
    description?: string;
    location?: string;
    sunlight?: string;
    wateringFrequency?: number;
    imageUrl?: string;
  },
) {
  return prisma.plant.updateMany({
    where: {
      id,
      userId,
    },
    data,
  });
}

export async function deletePlant(id: number, userId: number) {
  return prisma.plant.deleteMany({
    where: {
      id,
      userId,
    },
  });
}