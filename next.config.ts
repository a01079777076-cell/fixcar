// ═══════════════════════════════════════════════════
// 📁 저장 경로: next.config.ts
// ═══════════════════════════════════════════════════
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── 보안 헤더 ── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",   value: "nosniff" },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(self)" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://t1.kakaocdn.net https://www.googletagmanager.com https://www.google-analytics.com https://cdn.portone.io",
              "style-src 'self' 'unsafe-inline' https://hangeul.pstatic.net https://fonts.googleapis.com",
              "font-src 'self' https://hangeul.pstatic.net https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://kauth.kakao.com https://kapi.kakao.com https://www.google-analytics.com https://*.portone.io",
              "frame-src 'self' https://*.portone.io https://kauth.kakao.com",
              "worker-src 'self'",
            ].join("; "),
          },
        ],
      },
      /* Service Worker 캐시 헤더 */
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control",          value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },

  /* ── 이미지 최적화 ── */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
    ],
    deviceSizes:           [375, 430, 640, 768, 1024, 1280, 1360, 1920],
    imageSizes:            [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG:   true,
    contentDispositionType: "attachment",
  },

  /* ── 빌드 설정 ── */
  typescript: { ignoreBuildErrors: false },

  /* ── 압축 ── */
  compress: true,

  /* ── 서버 외부 패키지 (Prisma) ── */
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
