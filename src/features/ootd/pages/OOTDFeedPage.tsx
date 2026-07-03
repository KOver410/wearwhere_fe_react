import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Heart, ChevronRight, Plus } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { listFeed, likePost, unlikePost } from '@/features/ootd/api/ootdApi';
import type { OOTDPost } from '@/features/ootd/api/contracts';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

export function OOTDFeedPage() {
  const [posts, setPosts] = useState<OOTDPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { v } = useLanguage();
  const { isLoggedIn, promptLogin } = useAuth();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    listFeed({ limit: 50 })
      .then((res) => {
        if (active) setPosts(res.items);
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
  }, []);

  const toggleLike = (post: OOTDPost) => {
    if (!isLoggedIn) {
      promptLogin('/ootd');
      return;
    }
    const nextLiked = !post.liked_by_me;
    // Optimistic update; revert on failure.
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, liked_by_me: nextLiked, like_count: p.like_count + (nextLiked ? 1 : -1) }
          : p,
      ),
    );
    const request = nextLiked ? likePost(post.id) : unlikePost(post.id);
    request.catch(() => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, liked_by_me: post.liked_by_me, like_count: post.like_count }
            : p,
        ),
      );
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-4 lg:px-8 py-6 sm:py-8" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-5" style={{ fontSize: '13px', color: '#888', letterSpacing: '0.03em' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d' }}>OOTD</span>
        </nav>

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {v('STYLE DISCOVERY', 'KHÁM PHÁ PHONG CÁCH')}
          </h1>
          <Link
            to="/ootd/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
            style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', border: '2px solid #0d0d0d' }}
          >
            <Plus className="w-4 h-4" />
            {v('Post', 'Đăng bài')}
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20" data-testid="ootd-feed-loading">
            <p style={{ fontSize: '14px', color: '#888' }}>{v('Loading posts...', 'Đang tải bài viết...')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', textTransform: 'uppercase' }}>
              {v('Could not load the feed', 'Không thể tải bảng tin')}
            </p>
            <p style={{ fontSize: '14px', color: '#888' }}>{v('Please try again later.', 'Vui lòng thử lại sau.')}</p>
          </div>
        ) : posts.length > 0 ? (
          <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 640: 3, 1024: 4 }}>
            <Masonry gutter="32px">
              {posts.map(post => (
                <PostCard key={post.id} post={post} onToggleLike={() => toggleLike(post)} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <div className="text-center py-20">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', textTransform: 'uppercase' }}>
              {v('No posts yet', 'Chưa có bài viết')}
            </p>
            <Link
              to="/ootd/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d0d0d] text-white mt-2 hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              <Plus className="w-4 h-4" />
              {v('Share the first OOTD', 'Chia sẻ OOTD đầu tiên')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Post Card (KREAM minimal style) ─── */
function PostCard({ post, onToggleLike }: { post: OOTDPost; onToggleLike: () => void }) {
  return (
    <div className="group" style={{ paddingBottom: '24px' }}>
      {/* Image */}
      <Link to={`/ootd/${post.id}`} className="block relative overflow-hidden" style={{ borderRadius: '8px' }}>
        <ImageWithFallback
          src={post.photo_urls[0] ?? ''}
          alt={post.caption ?? ''}
          className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          style={{ display: 'block', minHeight: '180px' } as any}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.2) 100%)' }}
        />
      </Link>

      {/* Info row: author name on left, heart + count on right */}
      <div className="flex items-center justify-between" style={{ marginTop: '12px' }}>
        <span className="truncate" style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>
          {post.author_name}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(); }}
          className="flex items-center gap-1 flex-shrink-0"
          aria-label="like"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${post.liked_by_me ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#999] hover:text-[#d41c1c]'}`}
          />
          <span style={{ fontSize: '12px', color: '#999' }}>{post.like_count}</span>
        </button>
      </div>

      {/* Caption (short, 2 lines max) */}
      {post.caption && (
        <p className="line-clamp-2" style={{ fontSize: '13px', color: '#333', lineHeight: 1.4, marginTop: '6px' }}>
          {post.caption}
        </p>
      )}
    </div>
  );
}
