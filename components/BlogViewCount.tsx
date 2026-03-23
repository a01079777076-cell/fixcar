"use client";
import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

export default function BlogViewCount({ postId }: { postId: number }) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (!postId) return;
    /* 조회수 증가 + 가져오기 */
    fetch(`/api/blog/${postId}/views`, { method: "POST" })
      .then(r => r.json())
      .then(d => setViews(d.views || 0))
      .catch(() => {});
  }, [postId]);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#AAA" }}>
      <Eye size={12} /> {views}
    </span>
  );
}
