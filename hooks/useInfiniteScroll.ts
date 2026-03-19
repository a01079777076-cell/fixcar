// hooks/useInfiniteScroll.ts
"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface UseFetchOptions {
  url: string;
  pageSize?: number;
}

export function useInfiniteScroll<T>({ url, pageSize = 12 }: UseFetchOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`${url}?page=${page}&limit=${pageSize}`);
      const data = await res.json();
      if (data.success) {
        const newItems = data.data || [];
        setItems(prev => page === 1 ? newItems : [...prev, ...newItems]);
        setHasMore(newItems.length === pageSize);
        setPage(p => p + 1);
      }
    } catch { setHasMore(false); }
    setLoading(false);
  }, [url, page, pageSize, loading, hasMore]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  const reset = () => { setItems([]); setPage(1); setHasMore(true); };

  return { items, loading, hasMore, loadMoreRef, reset };
}
