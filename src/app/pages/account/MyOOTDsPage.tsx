import { Link } from 'react-router';
import { Heart, MessageCircle, Plus, Camera, Grid3X3 } from 'lucide-react';
import { AccountLayout } from '@/app/components/AccountLayout';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ootdPosts, currentUser } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function MyOOTDsPage() {
  const myPosts = ootdPosts.filter(p => p.user.id === currentUser.id);
  const { v } = useLanguage();

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('My OOTDs', 'OOTD của tôi')}</h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>{myPosts.length} {v('posts', 'bài đăng')}</p>
          </div>
          <Link
            to="/ootd/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
            style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            <Plus className="w-4 h-4" />{v('New OOTD', 'Tạo OOTD')}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: v('Posts', 'Bài viết'), value: myPosts.length, icon: Grid3X3 },
            { label: v('Total Likes', 'Tổng lượt thích'), value: myPosts.reduce((sum, p) => sum + p.likes, 0), icon: Heart },
            { label: v('Comments', 'Bình luận'), value: myPosts.reduce((sum, p) => sum + p.comments.length, 0), icon: MessageCircle },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-4 text-center" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#e2b93b' }} />
              <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {myPosts.length === 0 ? (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <Camera className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No OOTDs yet', 'Chưa có OOTD')}</p>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>{v('Share your first outfit of the day!', 'Chia sẻ bộ trang phục đầu tiên!')}</p>
            <Link to="/ootd/create" className="inline-block px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              {v('Create Your First OOTD', 'Tạo OOTD đầu tiên')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {myPosts.map(post => (
              <Link key={post.id} to={`/ootd/${post.id}`} className="group relative overflow-hidden aspect-square" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                <ImageWithFallback src={post.image} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-5 h-5 fill-white" />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{post.comments.length}</span>
                    </div>
                  </div>
                </div>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 text-white capitalize" style={{ fontSize: '11px', fontWeight: 600, borderRadius: '4px', backgroundColor: 'rgba(212,28,28,0.8)', letterSpacing: '0.05em', fontFamily: "'Oswald', sans-serif" }}>
                  {post.style}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
