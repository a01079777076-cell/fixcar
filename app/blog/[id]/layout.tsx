import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      select: { title: true, summary: true, content: true, category: true },
    });
    if (!post) return { title: "글을 찾을 수 없습니다" };

    const description = (post.content || "").replace(/<[^>]*>/g, "").slice(0, 160);
    const thumbnail = post.summary
      ? (post.summary.startsWith("http") ? post.summary : `https://www.fixcar.kr${post.summary}`)
      : undefined;

    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        ...(thumbnail && { images: [{ url: thumbnail, width: 1200, height: 630 }] }),
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        ...(thumbnail && { images: [thumbnail] }),
      },
    };
  } catch {
    return { title: "유용한 정보 | 픽스카" };
  }
}

export default function BlogDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
