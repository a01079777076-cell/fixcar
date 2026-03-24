"use client";
import Script from "next/script";

export default function PortOneScript() {
  return (
    <Script
      src="https://cdn.portone.io/v2/browser-sdk.js"
      strategy="lazyOnload"
    />
  );
}
