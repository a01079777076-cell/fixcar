import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const base = "https://www.fixcar.kr";
  const now = new Date().toISOString();

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/cars", priority: "0.9", changefreq: "daily" },
    { url: "/catalog", priority: "0.8", changefreq: "weekly" },
    { url: "/ranking", priority: "0.7", changefreq: "weekly" },
    { url: "/battle", priority: "0.7", changefreq: "weekly" },
    { url: "/mbti", priority: "0.7", changefreq: "monthly" },
    { url: "/blog", priority: "0.8", changefreq: "daily" },
    { url: "/community", priority: "0.7", changefreq: "daily" },
    { url: "/compare", priority: "0.6", changefreq: "weekly" },
    { url: "/price", priority: "0.6", changefreq: "weekly" },
    { url: "/contact", priority: "0.5", changefreq: "monthly" },
    { url: "/terms", priority: "0.3", changefreq: "yearly" },
    { url: "/privacy", priority: "0.3", changefreq: "yearly" },
    { url: "/dealer/apply", priority: "0.6", changefreq: "monthly" },
  ];

  let dynamicUrls = "";
  try {
    const cars = await prisma.car.findMany({ where: { status: "AVAILABLE" }, select: { id: true, updatedAt: true }, take: 500 });
    for (const car of cars) {
      dynamicUrls += `<url><loc>${base}/cars/${car.id}</loc><lastmod>${car.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    }
    const blogs = await prisma.blogPost.findMany({ where: { published: true }, select: { id: true, updatedAt: true }, take: 200 });
    for (const blog of blogs) {
      dynamicUrls += `<url><loc>${base}/blog/${blog.id}</loc><lastmod>${blog.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
    }
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `<url><loc>${base}${p.url}</loc><lastmod>${now}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`).join("\n")}
${dynamicUrls}
</urlset>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
