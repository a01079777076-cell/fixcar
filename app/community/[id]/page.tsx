// 📁 저장 경로: app/community/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import CommunityReplies from '@/components/CommunityReplies';
import ReportModal from '@/components/ReportModal';

interface PostAuthor {
  name: string;
  nickname: string;
}

interface CommunityPost {
  id: number;
  title: string;
  content: string;
  category: string;
  views: number;
  likes: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  flagReason: string | null;
  author: PostAuthor;
}

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const postId = params.id as string;

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/community/${postId}`);
      if (!res.ok) throw new Error('게시글을 찾을 수 없습니다');
      const data = await res.json();
      // API 응답: { post: {...}, comments: [...] }
      setPost(data.post);
    } catch {
      router.push('/community');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return alert('로그인이 필요합니다');
    try {
      const res = await fetch(`/api/community/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        setLiked(!liked);
        setPost(prev => prev ? { ...prev, likes: prev.likes + (liked ? -1 : 1) } : prev);
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/community/${postId}`, { method: 'DELETE' });
      if (res.ok) router.push('/community');
    } catch {}
  };

  const categoryMap: Record<string, string> = {
    free: '자유게시판',
    review: '차량 후기',
    '질문/답변': '질문/답변',
    qna: '질문/답변',
    '정보 공유': '정보 공유',
    info: '정보 공유',
    '모임/동호회': '모임/동호회',
    club: '모임/동호회',
    '차량 후기': '차량 후기',
    '자유게시판': '자유게시판',
  };

  const categoryColorMap: Record<string, string> = {
    free: '#888',
    review: '#2196F3',
    qna: '#FF9800',
    info: '#4CAF50',
    club: '#E91E63',
    '자유게시판': '#888',
    '차량 후기': '#2196F3',
    '질문/답변': '#FF9800',
    '정보 공유': '#4CAF50',
    '모임/동호회': '#E91E63',
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#999' }}>로딩 중...</p>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user?.id === post.authorId;
  const isAdmin = user?.role === 'ADMIN';
  const canDelete = isAuthor || isAdmin;
  const isEdited = post.updatedAt !== post.createdAt;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 80px' }}>
      {/* 뒤로가기 */}
      <Link href="/community" style={{ color: '#888', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        ‹ 목록
      </Link>

      {/* 본문 카드 */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', marginBottom: 16 }}>
        {/* 카테고리 + 날짜 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            background: categoryColorMap[post.category] || '#888',
          }}>
            {categoryMap[post.category] || post.category}
          </span>
          <span style={{ color: '#aaa', fontSize: 13 }}>
            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 14px', lineHeight: 1.3, color: '#1a1a1a' }}>
          {post.title}
        </h1>

        {/* 작성자 정보 + 조회수 + 액션 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: '#555' }}>
              👤 {post.author.nickname}
              <span style={{ color: '#aaa', fontSize: 12 }}> ({post.author.name})</span>
            </span>
            <span style={{ fontSize: 13, color: '#bbb' }}>👁 {post.views}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* 신고 버튼 */}
            {user && !isAuthor && (
              <button
                onClick={() => setShowReport(true)}
                style={{
                  padding: '5px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  background: '#fff',
                  color: '#999',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                🚨 신고
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                style={{
                  padding: '5px 12px',
                  border: '1px solid #ffcdd2',
                  borderRadius: 8,
                  background: '#fff',
                  color: '#e53935',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                🗑 삭제
              </button>
            )}
          </div>
        </div>

        {/* 수정됨 표시 */}
        {isEdited && (
          <p style={{ fontSize: 12, color: '#bbb', marginBottom: 16 }}>
            ✏️ {new Date(post.updatedAt).toLocaleDateString('ko-KR')} 수정됨
          </p>
        )}

        {/* 본문 */}
        <div style={{ fontSize: 15, lineHeight: 1.8, color: '#333', whiteSpace: 'pre-wrap', marginBottom: 28 }}>
          {post.content}
        </div>

        {/* 추천 */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '16px 32px',
              border: liked ? '2px solid #FF3B1E' : '2px solid #e0e0e0',
              borderRadius: 16,
              background: liked ? '#FFF5F4' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 24 }}>{liked ? '❤' : '🤍'}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: liked ? '#FF3B1E' : '#333' }}>{post.likes}</span>
            <span style={{ fontSize: 12, color: '#999' }}>추천</span>
          </button>
        </div>
      </div>

      {/* 댓글 */}
      <CommunityReplies postId={Number(postId)} currentUserId={user?.id} />

      {/* 신고 모달 */}
      {showReport && (
        <ReportModal
          postId={Number(postId)}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
