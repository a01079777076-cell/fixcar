"use client";
import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

export default function BlogViewCount({ postId }: { postId: number }) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (!postId) return;
    /* /view 와 /views 양쪽 시도 */
    fetch(`/api/blog/${postId}/view`, { method: "POST" })
      .then(r => r.ok ? r.json() : fetch(`/api/blog/${postId}/views`, { method: "POST" }).then(r2 => r2.json()))
      .then(d => setViews(d.views || 0))
      .catch(() => {});
  }, [postId]);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#AAA" }}>
      <Eye size={12} /> {views}
    </span>
  );
}
