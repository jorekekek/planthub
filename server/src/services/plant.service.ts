import prisma from "../lib/prisma";

export async function getPlants() {
  return prisma.plant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function getPlantById(id: number) {
  return prisma.plant.findUnique({
    where: {
      id,
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
  return prisma.plant.update({
    where: { id },
    data,
  });
}

export async function deletePlant(id: number) {
  return prisma.plant.delete({
    where: { id },
  });
}