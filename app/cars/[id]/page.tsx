import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CarDetailClient from "./CarDetailClient";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const car = await prisma.car.findUnique({ where: { id: parseInt(id) } });
    if (!car) return { title: "차량을 찾을 수 없어요" };
    return {
      title: `${car.name} | ${car.price.toLocaleString()}만원`,
      description: `${car.year}년식 · ${car.mileage.toLocaleString()}km · ${car.fuel} · FIX 정찰가 ${car.price.toLocaleString()}만원`,
    };
  } catch { return { title: "차량 상세" }; }
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
      include: { dealer: { select: { shopName:true, rating:true, dealCount:true } } },
    });
    if (!car) notFound();

    const carData = {
      ...car,
      status: car.status as string,
      dealer: {
        shopName: car.dealer?.shopName || "픽스카 딜러",
        rating: car.dealer?.rating || 4.8,
        dealCount: car.dealer?.dealCount || 0,
      },
    };

    return <CarDetailClient car={carData}/>;
  } catch { notFound(); }
}
