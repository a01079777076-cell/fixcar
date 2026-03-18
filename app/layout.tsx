import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    template: "%s | 픽스카 FIXCAR",
  },
  description: "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 믿고 사는 중고차. 이 차로 픽했다.",
  keywords: ["광주 중고차", "중고차", "픽스카", "fixcar", "정찰제", "중고차 직거래", "광주 자동차"],
  authors: [{ name: "픽스카 FIXCAR" }],
  creator: "픽스카 FIXCAR",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.fixcar.kr",
    siteName: "픽스카 FIXCAR",
    title: "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    description: "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 믿고 사는 중고차.",
  },
  twitter: {
    card: "summary_large_image",
    title: "픽스카 FIXCAR | 광주 중고차, 이 차로 픽했다",
    description: "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 믿고 사는 중고차.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://www.fixcar.kr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
