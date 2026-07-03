import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Heart, MessageCircle, Share2, ArrowLeft, Send, Tag } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { copyToClipboard } from '@/shared/utils/clipboard';
import { addComment, getPost, likePost, listComments, unlikePost } from '@/features/ootd/api/ootdApi';
import type { OOTDComment, OOTDPost } from '@/features/ootd/api/contracts';

export function OOTDDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = id ?? '';
  const { v } = useLanguage();
  const { user, isLoggedIn, promptLogin } = useAuth();

  const [post, setPost] = useState<OOTDPost | null>(null);
  const [comments, setComments] = useState<OOTDComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) {
      setError(true);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(false);
    Promise.all([getPost(postId), listComments(postId, { limit: 50 })])
      .then(([p, c]) => {
        if (active) {
          setPost(p);
          setComments(c.items);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `OOTD by ${post?.author_name ?? ''}`, text: post?.caption ?? '', url });
      } catch { /* user cancelled */ }
    } else {
      await copyToClipboard(url);
      alert(v('Link copied to clipboard!', 'Đã sao chép liên kết!'));
    }
  };

  const toggleLike = () => {
    if (!post) return;
    if (!isLoggedIn) {
      promptLogin(`/ootd/${postId}`);
      return;
    }
    const nextLiked = !post.liked_by_me;
    const previous = post;
    setPost({ ...post, liked_by_me: nextLiked, like_count: post.like_count + (nextLiked ? 1 : -1) });
    const request = nextLiked ? likePost(postId) : unlikePost(postId);
    request.catch(() => setPost(previous));
  };

  const submitComment = async () => {
    const body = comment.trim();
    if (!body || submitting || !post) return;
    if (!isLoggedIn) {
      promptLogin(`/ootd/${postId}`);
      return;
    }
    setSubmitting(true);
    try {
      const { id: newId } = await addComment(postId, body);
      setComments(prev => [
        ...prev,
        { id: newId, author_name: user?.name ?? '', body, created_at: new Date().toISOString() },
      ]);
      setPost(p => (p ? { ...p, comment_count: p.comment_count + 1 } : p));
      setComment('');
    } catch {
      alert(v('Could not post your comment. Please try again.', 'Không thể đăng bình luận. Vui lòng thử lại.'));
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return v('Just now', 'Vừa xong');
    if (hours < 24) return v(`${hours}h ago`, `${hours} giờ trước`);
    const days = Math.floor(hours / 24);
    return v(`${days}d ago`, `${days} ngày trước`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <p style={{ fontSize: '14px', color: '#888' }}>{v('Loading post...', 'Đang tải bài viết...')}</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center">
          <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', textTransform: 'uppercase' as const }}>{v('Post not found', 'Không tìm thấy bài viết')}</p>
          <Link to="/ootd" className="px-6 py-3 bg-[#d41c1c] text-white inline-block hover:bg-[#b01818] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #d41c1c' }}>
            {v('Back to Feed', 'Quay lại bảng tin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Link to="/ootd" className="inline-flex items-center gap-2 mb-6 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <ArrowLeft className="w-4 h-4" />{v('Back to Feed', 'Quay lại bảng tin')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="overflow-hidden" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
            <ImageWithFallback src={post.photo_urls[0] ?? ''} alt={post.caption ?? ''} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="flex flex-col">
            {/* Author */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f3f0eb', border: '2px solid #e2b93b' }}>
                <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>{(post.author_name[0] ?? '?').toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>
                  {post.author_name}
                </p>
                <p style={{ fontSize: '13px', color: '#888' }}>{timeAgo(post.created_at)}</p>
              </div>
            </div>

            {/* Caption */}
            {post.caption && <p style={{ fontSize: '16px', color: '#0d0d0d', lineHeight: '1.6', marginBottom: '16px' }}>{post.caption}</p>}

            {/* Actions */}
            <div className="flex items-center gap-6 py-4 my-4" style={{ borderTop: '1px solid #e0d8cf', borderBottom: '1px solid #e0d8cf' }}>
              <button onClick={toggleLike} className="flex items-center gap-2 group" aria-label="like">
                <Heart className={`w-6 h-6 transition-colors ${post.liked_by_me ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#4a4a4a] group-hover:text-[#d41c1c]'}`} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{post.like_count}</span>
              </button>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-[#4a4a4a]" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{post.comment_count}</span>
              </div>
              <button onClick={handleShare} aria-label="share"><Share2 className="w-6 h-6 text-[#4a4a4a] hover:text-[#0d0d0d] transition-colors" /></button>
            </div>

            {/* Tagged Products */}
            {post.tags.length > 0 && (
              <div className="mb-6">
                <p style={{ fontSize: '14px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Shop This Look', 'Mua theo phong cách')}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link key={tag.product_id} to={`/product/${tag.slug}`} className="inline-flex items-center gap-2 px-3 py-2 transition-colors hover:bg-[#e0d8cf]" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
                      <Tag className="w-3.5 h-3.5" style={{ color: '#d41c1c' }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{tag.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="flex-1">
              <p style={{ fontSize: '14px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
                {v(`Comments (${comments.length})`, `Bình luận (${comments.length})`)}
              </p>
              <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f3f0eb', border: '1px solid #e0d8cf' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0d0d0d' }}>{(c.author_name[0] ?? '?').toUpperCase()}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', color: '#0d0d0d' }}>
                        <span style={{ fontWeight: 600 }}>{c.author_name}</span> {c.body}
                      </p>
                      <span style={{ fontSize: '12px', color: '#888' }}>{timeAgo(c.created_at)}</span>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', padding: '20px 0' }}>{v('No comments yet. Be the first!', 'Chưa có bình luận. Hãy là người đầu tiên!')}</p>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2 mt-auto">
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitComment()}
                  placeholder={v('Add a comment...', 'Thêm bình luận...')}
                  className="flex-1 px-4 py-2 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                  style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
                />
                <button onClick={submitComment} disabled={!comment.trim() || submitting} className="p-2 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors disabled:bg-[#e0d8cf]" style={{ borderRadius: '10px' }} aria-label="send comment">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
