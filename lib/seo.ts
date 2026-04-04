// 📁 저장 경로: lib/seo.ts
// SEO 메타데이터 헬퍼 — 각 페이지에서 import하여 사용

import type { Metadata } from "next";

const BASE_URL = "https://www.fixcar.kr";
const SITE_NAME = "픽스카 FIXCAR";
const DEFAULT_DESC = "광주 1위 중고차 정찰제 플랫폼. FIX 정찰가로 흥정 없이, 100항목 검수로 안전하게.";
const DEFAULT_OG = "/og-image.png";

interface SeoParams {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noindex?: boolean;
}

export function generateSeo({
  title,
  description = DEFAULT_DESC,
  path = "",
  image = DEFAULT_OG,
  keywords = [],
  noindex = false,
}: SeoParams): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;
  const defaultKeywords = [
    "광주 중고차", "픽스카", "FIXCAR", "중고차 정찰제", "광주 딜러",
    "중고차 검수", "FIX 가격", "무사고 중고차",
  ];

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [{ url: image.startsWith("http") ? image : `${BASE_URL}${image}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${BASE_URL}${image}`],
    },
    alternates: { canonical: url },
  };
}

/**
 * 매물 상세 페이지용 SEO
 */
export function generateCarSeo(car: {
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  region: string;
  images?: string[];
  id: number;
}): Metadata {
  const title = `${car.brand} ${car.name} ${car.year}년식 ${car.price.toLocaleString()}만원`;
  const desc = `${car.brand} ${car.name} | ${car.year}년식 · ${car.mileage.toLocaleString()}km · ${car.region} | FIX 정찰가 ${car.price.toLocaleString()}만원 | 픽스카에서 안전하게 구매하세요.`;
  const image = car.images?.[0] || DEFAULT_OG;

  return generateSeo({
    title,
    description: desc,
    path: `/cars/${car.id}`,
    image,
    keywords: [car.brand, car.name, `${car.year}년식`, `${car.region} 중고차`, "중고차 매물"],
  });
}

/**
 * 블로그 글용 SEO
 */
export function generateBlogSeo(post: {
  title: string;
  summary: string;
  id: number;
}): Metadata {
  return generateSeo({
    title: post.title,
    description: post.summary,
    path: `/blog/${post.id}`,
    keywords: ["중고차 가이드", "자동차 팁", "중고차 구매"],
  });
}
