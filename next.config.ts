import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 보안 헤더 */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://t1.kakaocdn.net https://www.googletagmanager.com https://www.google-analytics.com https://cdn.portone.io",
              "style-src 'self' 'unsafe-inline' https://hangeul.pstatic.net https://fonts.googleapis.com",
              "font-src 'self' https://hangeul.pstatic.net https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://kauth.kakao.com https://kapi.kakao.com https://www.google-analytics.com https://*.portone.io",
              "frame-src 'self' https://*.portone.io https://kauth.kakao.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  /* 이미지 도메인 허용 */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  /* 빌드 설정 */
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
