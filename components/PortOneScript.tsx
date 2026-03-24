"use client";
import Script from "next/script";

export default function PortOneScript() {
  return (
    <Script
      src="https://cdn.iamport.kr/v1/iamport.js"
      strategy="lazyOnload"
    />
  );
}
