"use client";
import { useState, useEffect } from "react";

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
}

interface Props {
  position?: "CARS" | "HOME" | "SIDEBAR";
}

export default function AdBanner({ position = "CARS" }: Props) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`/api/banners?position=${position}`)
      .then((r) => r.json())
      .then((d) => setBanners(Array.isArray(d.data) ? d.data : []))
      .catch(() => {});
  }, [position]);

  /* 배너 자동 슬라이드 (복수일 때) */
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div style={{ margin: "12px 0", position: "relative" }}>
      {/* 광고 라벨 */}
      <span
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          background: "rgba(0,0,0,0.4)",
          color: "white",
          fontSize: 9,
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: 4,
          letterSpacing: 0.5,
        }}
      >
        광고
      </span>

      {banner.linkUrl ? (
        <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
          <BannerImage banner={banner} />
        </a>
      ) : (
        <BannerImage banner={banner} />
      )}

      {/* 도트 인디케이터 */}
      {banners.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 5,
            marginTop: 8,
          }}
        >
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 16 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? "#FF3B1E" : "#D0CEC9",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.25s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BannerImage({ banner }: { banner: Banner }) {
  return (
    <div
      style={{
        borderRadius: 14,
        overflow: "hidden",
        height: 80,
        background: "#E8E6E1",
        position: "relative",
      }}
    >
      <img
        src={banner.imageUrl}
        alt={banner.title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => {
          /* 이미지 로딩 실패 시 텍스트 배너로 대체 */
          const el = e.currentTarget.parentElement as HTMLDivElement;
          if (el) {
            el.style.background = "linear-gradient(135deg, #0066FF, #003399)";
            el.style.display = "flex";
            el.style.alignItems = "center";
            el.style.justifyContent = "center";
            e.currentTarget.style.display = "none";
            el.innerHTML += `<span style="color:white;fontWeight:800;fontSize:14px">${banner.title}</span>`;
          }
        }}
      />
    </div>
  );
}
