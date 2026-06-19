import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Heart, ChevronRight, Plus, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ootdPosts, type OOTDPost } from '@/app/data/accountMockData';
import { STYLES } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const SORT_OPTIONS_OOTD = [
  { key: 'popular', en: 'Most Popular', vi: 'Phổ biến nhất' },
  { key: 'newest', en: 'Newest', vi: 'Mới nhất' },
  { key: 'oldest', en: 'Oldest', vi: 'Cũ nhất' },
];

export function OOTDFeedPage() {
  const [posts, setPosts] = useState<OOTDPost[]>(ootdPosts);
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [sortBy, setSortBy] = useState('popular');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const { v, lang } = useLanguage();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = (() => {
    let result = selectedStyle === 'all' ? posts : posts.filter(p => p.style === selectedStyle);
    if (sortBy === 'popular') result = [...result].sort((a, b) => b.likes - a.likes);
    else if (sortBy === 'newest') result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === 'oldest') result = [...result].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return result;
  })();

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const currentSort = SORT_OPTIONS_OOTD.find(s => s.key === sortBy)!;

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

        {/* Style filter tabs — KREAM text-tab style */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex gap-0 overflow-x-auto scrollbar-hover-show pb-1">
            <TabButton
              label={v('All', 'Tất cả')}
              active={selectedStyle === 'all'}
              onClick={() => setSelectedStyle('all')}
            />
            {STYLES.map(s => (
              <TabButton
                key={s.slug}
                label={lang === 'vi' ? s.nameVi : s.name}
                active={selectedStyle === s.slug}
                onClick={() => setSelectedStyle(s.slug)}
              />
            ))}
          </div>
        </div>

        {/* Sort bar */}
        <div className="flex justify-end items-center mb-5">
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 hover:text-[#0d0d0d] transition-colors"
              style={{ fontSize: '13px', color: '#666' }}
            >
              {lang === 'vi' ? currentSort.vi : currentSort.en}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white z-30 py-1" style={{ borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: '160px' }}>
                {SORT_OPTIONS_OOTD.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setSortBy(opt.key); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2 transition-colors ${sortBy === opt.key ? 'bg-[#f3f0eb]' : 'hover:bg-[#f9f7f4]'}`}
                    style={{ fontSize: '13px', color: sortBy === opt.key ? '#0d0d0d' : '#666', fontWeight: sortBy === opt.key ? 600 : 400 }}
                  >
                    {lang === 'vi' ? opt.vi : opt.en}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Masonry Grid — KREAM style */}
        {filtered.length > 0 ? (
          <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 640: 3, 1024: 4 }}>
            <Masonry gutter="32px">
              {filtered.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  caption={v(post.caption, post.captionVi)}
                  onToggleLike={() => toggleLike(post.id)}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <div className="text-center py-20">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', textTransform: 'uppercase' }}>
              {v('No posts in this style', 'Không có bài nào với phong cách này')}
            </p>
            <button
              onClick={() => setSelectedStyle('all')}
              className="px-6 py-3 bg-[#0d0d0d] text-white mt-2 hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {v('View All', 'Xem tất cả')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Tab Button (KREAM-style text with underline) ─── */
function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group/tab flex-shrink-0 px-4 py-2.5 transition-all relative"
      style={{
        fontSize: '14px',
        fontWeight: active ? 700 : 400,
        color: active ? '#0d0d0d' : '#999',
        letterSpacing: '0.01em',
      }}
    >
      <span className="group-hover/tab:text-[#d41c1c] transition-colors">{label}</span>
      <span
        className={`absolute bottom-0 left-4 right-4 transition-all duration-200 ${
          active
            ? 'opacity-100'
            : 'opacity-0 group-hover/tab:opacity-100'
        }`}
        style={{
          height: '2px',
          backgroundColor: active ? '#d41c1c' : '#d41c1c',
          borderRadius: '1px',
        }}
      />
    </button>
  );
}

/* ─── Post Card (KREAM minimal style) ─── */
function PostCard({ post, caption, onToggleLike }: { post: OOTDPost; caption: string; onToggleLike: () => void }) {
  return (
    <div className="group" style={{ paddingBottom: '24px' }}>
      {/* Image */}
      <Link to={`/ootd/${post.id}`} className="block relative overflow-hidden" style={{ borderRadius: '8px' }}>
        <ImageWithFallback
          src={post.image}
          alt={caption}
          className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          style={{ display: 'block', minHeight: '180px' } as any}
        />
        {/* Subtle overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.2) 100%)' }}
        />
      </Link>

      {/* Info row: avatar + username on left, heart + count on right */}
      <div className="flex items-center justify-between" style={{ marginTop: '12px' }}>
        <Link to={`/user/${post.user.username}`} className="flex items-center gap-2 min-w-0">
          <ImageWithFallback
            src={post.user.avatar}
            alt={post.user.username}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <span className="truncate" style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>
            {post.user.username}
          </span>
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(); }}
          className="flex items-center gap-1 flex-shrink-0"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${post.isLiked ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#999] hover:text-[#d41c1c]'}`}
          />
          <span style={{ fontSize: '12px', color: '#999' }}>{post.likes}</span>
        </button>
      </div>

      {/* Caption (short, 2 lines max) */}
      {caption && (
        <p className="line-clamp-2" style={{ fontSize: '13px', color: '#333', lineHeight: 1.4, marginTop: '6px' }}>
          {caption}
        </p>
      )}
    </div>
  );
}