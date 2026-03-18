import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fixcar.kr"),
  title: {
    default: "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    template: "%s | 픽스카 FIXCAR",
  },
  description: "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 믿고 사는 중고차. 아반떼·K3·투싼·전기차 등 광주 중고차 전체 매물.",
  keywords: [
    "광주 중고차", "광주 중고차 직거래", "픽스카", "FIXCAR", "중고차 정찰제",
    "광주 자동차", "중고차 구매", "FIX 가격", "무사고 중고차", "아반떼 중고차",
    "K3 중고차", "투싼 중고차", "전기차 중고", "광주 딜러", "중고차 할부"
  ],
  authors: [{ name: "픽스카 FIXCAR", url: "https://www.fixcar.kr" }],
  creator: "픽스카 FIXCAR",
  publisher: "픽스카 FIXCAR",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.fixcar.kr",
    siteName: "픽스카 FIXCAR",
    title: "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    description: "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 믿고 사는 중고차.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "픽스카 FIXCAR - 광주 중고차 정찰제 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    description: "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 믿고 사는 중고차.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "구글 서치콘솔에서 발급받은 코드 입력",
    other: {
      "naver-site-verification": "ef154da2a6ec7ab1f255ab654ae513a16c0",
    },
  },
  alternates: {
    canonical: "https://www.fixcar.kr",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="geo.region" content="KR-29" />
        <meta name="geo.placename" content="광주광역시" />
        <meta name="geo.position" content="35.1595;126.8526" />
        <meta name="ICBM" content="35.1595, 126.8526" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": "픽스카 FIXCAR",
              "description": "광주 1위 중고차 정찰제 플랫폼",
              "url": "https://www.fixcar.kr",
              "logo": "https://www.fixcar.kr/favicon.svg",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "광주광역시",
                "addressCountry": "KR",
              },
              "areaServed": "광주광역시",
              "priceRange": "500만원~",
              "openingHours": "Mo-Su 00:00-24:00",
              "sameAs": ["https://www.fixcar.kr"],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
