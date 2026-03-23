"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  summary?: string;
  category?: string;
  content?: string;
  createdAt: string;
  author?: { name?: string };
}

function extractThumbnail(post: BlogPost): string {
  /* 1순위: summary에 URL이 있으면 (썸네일로 사용) */
  if (post.summary && (post.summary.startsWith("http://") || post.summary.startsWith("https://"))) {
    return post.summary;
  }
  /* 2순위: content에서 이미지 URL 추출 */
  if (post.content) {
    /* HTML img 태그 */
    const imgMatch = post.content.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch) return imgMatch[1];
    /* [이미지: URL] 형식 */
    const bracketMatch = post.content.match(/\[이미지:\s*(https?:\/\/[^\]]+)\]/);
    if (bracketMatch) return bracketMatch[1];
    /* 일반 URL */
    const urlMatch = post.content.match(/(https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp))/i);
    if (urlMatch) return urlMatch[1];
  }
  return "";
}

export default function HomeBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog?limit=4")
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : d.posts || d.data || [];
        setPosts(arr.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto 60px", padding: "0 52px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, color: "#FF3B1E", marginBottom: 6 }}>BLOG</div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>픽스카 블로그</h2>
        </div>
        <Link href="/blog" style={{ fontSize: 13, fontWeight: 700, color: "#888", textDecoration: "none" }}>전체 보기 →</Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {posts.map(post => {
          const thumb = extractThumbnail(post);
          return (
            <Link key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "white", borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ height: 160, background: "#F0EEE9", overflow: "hidden", position: "relative" }}>
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, opacity: 0.2 }}>📝</div>
                  )}
                  {post.category && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#FF3B1E", color: "white", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 800 }}>{post.category}</span>
                  )}
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.title}</div>
                  <div style={{ fontSize: 11, color: "#CCC" }}>
                    {post.author?.name || "픽스카"} · {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
