// 📁 저장 경로: app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.fixcar.kr";
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/cars`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${baseUrl}/catalog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/community`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${baseUrl}/ranking`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${baseUrl}/battle`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/mbti`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/quiz-select`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/inspection`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/agent`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/clean`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/notice`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/complexes`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/shops`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${baseUrl}/dealer/apply`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  // Dynamic car pages
  let carPages: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import("@/lib/prisma");
    const cars = await prisma.car.findMany({
      where: { status: "AVAILABLE" },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });
    carPages = cars.map((car) => ({
      url: `${baseUrl}/cars/${car.id}`,
      lastModified: car.updatedAt.toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch {}

  return [...staticPages, ...carPages];
}
