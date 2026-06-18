import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft, BadgeCheck, MapPin, Send } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ootdPosts, currentUser } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { copyToClipboard } from '@/app/utils/clipboard';

export function OOTDDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = ootdPosts.find(p => p.id === Number(id));
  const [isLiked, setIsLiked] = useState(post?.isLiked ?? false);
  const [likes, setLikes] = useState(post?.likes ?? 0);
  const [isSaved, setIsSaved] = useState(post?.isSaved ?? false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post?.comments ?? []);
  const [isFollowing, setIsFollowing] = useState(false);
  const { v, lang } = useLanguage();

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: v(`OOTD by ${post?.user.username}`, `OOTD của ${post?.user.username}`), text: post?.caption || '', url });
      } catch { /* user cancelled */ }
    } else {
      await copyToClipboard(url);
      alert(v('Link copied to clipboard!', 'Đã sao chép liên kết!'));
    }
  };

  if (!post) {
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

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, { id: Date.now(), user: { username: currentUser.username, avatar: currentUser.avatar }, text: comment, date: v('Just now', 'Vừa xong'), likes: 0 }]);
    setComment('');
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return v('Just now', 'Vừa xong');
    if (hours < 24) return v(`${hours}h ago`, `${hours} giờ trước`);
    const days = Math.floor(hours / 24);
    return v(`${days}d ago`, `${days} ngày trước`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Link to="/ootd" className="inline-flex items-center gap-2 mb-6 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <ArrowLeft className="w-4 h-4" />{v('Back to Feed', 'Quay lại bảng tin')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="overflow-hidden" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
            <ImageWithFallback src={post.image} alt={post.caption} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="flex flex-col">
            {/* User */}
            <div className="flex items-center gap-3 mb-6">
              <Link to={`/user/${post.user.username}`}>
                <ImageWithFallback src={post.user.avatar} alt={post.user.fullName} className="w-12 h-12 rounded-full object-cover" style={{ border: '2px solid #e2b93b' } as any} />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Link to={`/user/${post.user.username}`} className="hover:underline" style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>
                    {post.user.fullName}
                  </Link>
                  {post.user.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '13px', color: '#888' }}>@{post.user.username}</span>
                  {post.location && (
                    <span className="flex items-center gap-0.5" style={{ fontSize: '12px', color: '#888' }}>
                      <MapPin className="w-3 h-3" />{post.location}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setIsFollowing(!isFollowing)} className={`px-4 py-2 border-2 transition-colors ${isFollowing ? 'bg-[#d41c1c] text-white border-[#d41c1c]' : 'border-[#d41c1c] text-[#d41c1c] hover:bg-[#d41c1c] hover:text-white'}`} style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {isFollowing ? v('Following', 'Đang theo dõi') : v('Follow', 'Theo dõi')}
              </button>
            </div>

            {/* Caption */}
            <p style={{ fontSize: '16px', color: '#0d0d0d', lineHeight: '1.6', marginBottom: '12px' }}>{post.caption}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <Link key={tag} to={`/ootd?tag=${tag}`} className="px-3 py-1 hover:bg-[#e0d8cf] transition-colors" style={{ fontSize: '13px', color: '#4a4a4a', borderRadius: '9999px', backgroundColor: '#f3f0eb' }}>
                  #{tag}
                </Link>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#888' }}>{timeAgo(post.createdAt)}</p>

            {/* Actions */}
            <div className="flex items-center justify-between py-4 my-4" style={{ borderTop: '1px solid #e0d8cf', borderBottom: '1px solid #e0d8cf' }}>
              <div className="flex items-center gap-6">
                <button onClick={toggleLike} className="flex items-center gap-2 group">
                  <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#4a4a4a] group-hover:text-[#d41c1c]'}`} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{likes}</span>
                </button>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-[#4a4a4a]" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{comments.length}</span>
                </div>
                <button onClick={handleShare}><Share2 className="w-6 h-6 text-[#4a4a4a] hover:text-[#0d0d0d] transition-colors" /></button>
              </div>
              <button onClick={() => setIsSaved(!isSaved)}>
                <Bookmark className={`w-6 h-6 transition-colors ${isSaved ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#4a4a4a] hover:text-[#d41c1c]'}`} />
              </button>
            </div>

            {/* Tagged Products */}
            {post.products.length > 0 && (
              <div className="mb-6">
                <p style={{ fontSize: '14px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Shop This Look', 'Mua theo phong cách')}</p>
                <div className="space-y-2">
                  {post.products.map(prod => (
                    <Link key={prod.id} to={`/product/${prod.id}`} className="flex items-center gap-3 p-3 hover:bg-[#e0d8cf] transition-colors" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
                      <ImageWithFallback src={prod.image} alt={prod.name} className="w-14 h-14 object-cover" style={{ borderRadius: '4px' } as any} />
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-1" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{prod.name}</p>
                        <p style={{ fontSize: '12px', color: '#888' }}>{prod.brand}</p>
                      </div>
                      <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>${prod.price}</p>
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
                    <ImageWithFallback src={c.user.avatar} alt={c.user.username} className="w-8 h-8 rounded-full object-cover flex-shrink-0" style={{ border: '1px solid #e0d8cf' } as any} />
                    <div>
                      <p style={{ fontSize: '14px', color: '#0d0d0d' }}>
                        <span style={{ fontWeight: 600 }}>{c.user.username}</span> {c.text}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span style={{ fontSize: '12px', color: '#888' }}>{c.date}</span>
                        <button style={{ fontSize: '12px', color: '#888' }}>{c.likes} {v('likes', 'thích')}</button>
                        <button style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c' }}>{v('Reply', 'Trả lời')}</button>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', padding: '20px 0' }}>{v('No comments yet. Be the first!', 'Chưa có bình luận. Hãy là người đầu tiên!')}</p>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2 mt-auto">
                <ImageWithFallback src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addComment()}
                    placeholder={v('Add a comment...', 'Thêm bình luận...')}
                    className="flex-1 px-4 py-2 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                    style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
                  />
                  <button onClick={addComment} disabled={!comment.trim()} className="p-2 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors disabled:bg-[#e0d8cf]" style={{ borderRadius: '10px' }}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}