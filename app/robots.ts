import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dealer", "/api", "/auth"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/dealer", "/api", "/auth"],
      },
      {
        userAgent: "Yeti", // 네이버 봇
        allow: "/",
        disallow: ["/admin", "/dealer", "/api", "/auth"],
      },
    ],
    sitemap: "https://www.fixcar.kr/sitemap.xml",
  };
}
