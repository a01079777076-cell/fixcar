import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* 동적 사이트맵 생성 */
export async function GET() {
  try {
    const baseUrl = "https://www.fixcar.kr";

    /* 블로그 글 */
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    /* 차량 매물 */
    const cars = await prisma.car.findMany({
      where: { status: "AVAILABLE" },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/cars", priority: "0.9", changefreq: "daily" },
      { url: "/catalog", priority: "0.8", changefreq: "weekly" },
      { url: "/ranking", priority: "0.8", changefreq: "weekly" },
      { url: "/mbti", priority: "0.7", changefreq: "monthly" },
      { url: "/battle", priority: "0.6", changefreq: "monthly" },
      { url: "/blog", priority: "0.8", changefreq: "daily" },
      { url: "/community", priority: "0.7", changefreq: "daily" },
      { url: "/clean", priority: "0.5", changefreq: "monthly" },
      { url: "/dealer/apply", priority: "0.6", changefreq: "monthly" },
      { url: "/contact", priority: "0.4", changefreq: "monthly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const p of staticPages) {
      xml += `
  <url>
    <loc>${baseUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
    }

    for (const post of posts) {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    for (const car of cars) {
      xml += `
  <url>
    <loc>${baseUrl}/cars/${car.id}</loc>
    <lastmod>${car.updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    xml += "\n</urlset>";

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch {
    return new NextResponse("<urlset></urlset>", {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
