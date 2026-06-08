import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomTabBar from "@/components/BottomTabBar";
import PortOneScript from "@/components/PortOneScript";
import WelcomePopup from "@/components/WelcomePopup";
import Providers from "@/components/Providers";
import FaqChatbot from "@/components/FaqChatbot";

const GA_ID        = process.env.NEXT_PUBLIC_GA_ID    || "G-XXXXXXXXXX";
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";

/* ── SEO 메타데이터 ── */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.fixcar.kr"),
  title: {
    default:  "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    template: "%s | 픽스카 FIXCAR",
  },
  description: "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 믿고 사는 중고차. 무사고 인증, 허위매물 ZERO.",
  keywords: [
    "광주 중고차","광주 중고차 직거래","픽스카","FIXCAR","중고차 정찰제",
    "광주 자동차","중고차 구매","FIX 가격","무사고 중고차","중고차 검수",
    "광주 딜러","중고차 할부","광주 매매단지","전기차 중고",
  ],
  authors:   [{ name: "픽스카 FIXCAR", url: "https://www.fixcar.kr" }],
  creator:   "픽스카 FIXCAR",
  publisher: "픽스카 FIXCAR",
  robots:    { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type:        "website",
    locale:      "ko_KR",
    url:         "https://www.fixcar.kr",
    siteName:    "픽스카 FIXCAR",
    title:       "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    description: "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 믿고 사는 중고차.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "픽스카 FIXCAR - 광주 중고차 정찰제 플랫폼" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    description: "광주 1위 중고차 정찰제 플랫폼.",
    images:      ["/og-image.png"],
  },
  verification: {
    google: "구글서치콘솔코드입력",
    other:  { "naver-site-verification": "ef154da2a6ec7ab1f255ab654ae513a16c055191" },
  },
  alternates: { canonical: "https://www.fixcar.kr" },
  icons: {
    icon:      [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple:     [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut:  "/favicon.svg",
  },
  /* PWA manifest */
  manifest: "/manifest.json",
  /* Apple PWA */
  appleWebApp: {
    capable:        true,
    statusBarStyle: "default",
    title:          "픽스카",
  },
};

/* ── viewport (Next.js 14+ 분리) ── */
export const viewport: Viewport = {
  themeColor:          "#FF3B1E",
  width:               "device-width",
  initialScale:        1,
  maximumScale:        5,
  userScalable:        true,
  viewportFit:         "cover",
};

/* ── JSON-LD 구조화 데이터 ── */
const jsonLdAutoDealer = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "@id": "https://www.fixcar.kr/#organization",
  "name": "픽스카 FIXCAR",
  "description": "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 검수 인증 중고차.",
  "url": "https://www.fixcar.kr",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.fixcar.kr/favicon.svg",
    "width": 512,
    "height": 512,
  },
  "image": "https://www.fixcar.kr/og-image.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "광주광역시",
    "addressRegion": "광주",
    "addressCountry": "KR",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 35.1595,
    "longitude": 126.8526,
  },
  "areaServed": [
    { "@type": "City", "name": "광주광역시" },
    { "@type": "AdministrativeArea", "name": "전라남도" },
  ],
  "priceRange": "$$",
  "openingHours": "Mo-Su 00:00-24:00",
  "email": "help@fixcar.kr",
  "sameAs": ["https://www.fixcar.kr"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "픽스카 중고차 매물",
    "url": "https://www.fixcar.kr/cars",
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.fixcar.kr/#website",
  "name": "픽스카 FIXCAR",
  "url": "https://www.fixcar.kr",
  "inLanguage": "ko-KR",
  "publisher": { "@id": "https://www.fixcar.kr/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.fixcar.kr/cars?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈",        "item": "https://www.fixcar.kr" },
    { "@type": "ListItem", "position": 2, "name": "전체 매물",  "item": "https://www.fixcar.kr/cars" },
    { "@type": "ListItem", "position": 3, "name": "카탈로그",   "item": "https://www.fixcar.kr/catalog" },
    { "@type": "ListItem", "position": 4, "name": "유용한 정보", "item": "https://www.fixcar.kr/blog" },
    { "@type": "ListItem", "position": 5, "name": "커뮤니티",   "item": "https://www.fixcar.kr/community" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* ── Google Analytics ── */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        ` }} />

        {/* ── Kakao SDK ── */}
        {KAKAO_JS_KEY && (
          <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" crossOrigin="anonymous" />
        )}
        {KAKAO_JS_KEY && (
          <script dangerouslySetInnerHTML={{ __html: `
            document.addEventListener('DOMContentLoaded', function() {
              if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init('${KAKAO_JS_KEY}');
              }
            });
          ` }} />
        )}

        {/* ── Geo 메타 (광주) ── */}
        <meta name="geo.region"    content="KR-29" />
        <meta name="geo.placename" content="광주광역시" />
        <meta name="geo.position"  content="35.1595;126.8526" />
        <meta name="ICBM"          content="35.1595, 126.8526" />

        {/* ── 모바일 앱 메타 ── */}
        <meta name="mobile-web-app-capable"              content="yes" />
        <meta name="application-name"                    content="픽스카" />
        <meta name="msapplication-TileColor"             content="#FF3B1E" />
        <meta name="msapplication-TileImage"             content="/icon-192.png" />
        <meta name="msapplication-config"                content="none" />
        <meta name="format-detection"                    content="telephone=no" />

        {/* ── iOS 앱 연결 (Apple App Store ID 발급 후 교체) ── */}
        <meta name="apple-itunes-app"                    content="app-id=000000000, app-argument=https://www.fixcar.kr" />

        {/* ── iOS 스플래시 스크린 ── */}
        <link rel="apple-touch-startup-image" href="/icon-512.png" />

        {/* ── Android 앱 연결 ── */}
        <meta name="google-play-app"                     content="app-id=kr.fixcar.app" />

        {/* ── JSON-LD 구조화 데이터 ── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAutoDealer) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

        {/* ── Service Worker 등록 ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(function(reg) { console.log('[SW] 등록 성공:', reg.scope); })
                .catch(function(err) { console.warn('[SW] 등록 실패:', err); });
            });
          }
        ` }} />
      </head>
      <body>
        <Providers>
          {children}
          <BottomTabBar />
          <PortOneScript />
          <WelcomePopup />
          <FaqChatbot />
        </Providers>
      </body>
    </html>
  );
}
