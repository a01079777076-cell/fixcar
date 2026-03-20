"use client";
import Script from "next/script";

/**
 * PortOne V2 결제 SDK 로더
 * app/layout.tsx 또는 결제 페이지에 삽입
 */
export default function PortOneScript() {
  return (
    <Script
      src="https://cdn.portone.io/v2/browser-sdk.js"
      strategy="afterInteractive"
    />
  );
}
