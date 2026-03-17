import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CarDetailClient from "./CarDetailClient";

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id: parseInt(id) },
    include: {
      dealer: {
        select: {
          shopName: true,
          rating: true,
          dealCount: true,
          verified: true,
        },
      },
    },
  });

  if (!car) notFound();

  return <CarDetailClient car={car} />;
}
