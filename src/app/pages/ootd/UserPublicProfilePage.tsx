import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Heart, MessageCircle, Grid3X3, BadgeCheck, MapPin, Calendar, ArrowLeft, UserPlus } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ootdPosts } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock user profiles
const userProfiles: Record<string, { fullName: string; avatar: string; bio: string; followers: number; following: number; location: string; joinDate: string; verified: boolean }> = {
  fashionista_vn: { fullName: 'Nguyễn Minh Anh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', bio: 'Fashion lover | Streetwear enthusiast | Saigon based', followers: 1240, following: 380, location: 'Ho Chi Minh City', joinDate: '2025-06-15', verified: false },
  style_queen: { fullName: 'Trần Thị Bảo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', bio: 'Fashion blogger | Vintage & Korean style | Content creator', followers: 8500, following: 420, location: 'Hanoi', joinDate: '2024-12-01', verified: true },
  urban_guy: { fullName: 'Lê Hoàng Nam', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', bio: 'Minimalist fashion | Coffee addict ☕', followers: 620, following: 210, location: 'Da Nang', joinDate: '2025-09-20', verified: false },
  kfashion_luna: { fullName: 'Phạm Thùy Linh', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', bio: 'K-Fashion inspired | Y2K vibes | Beach lover', followers: 5200, following: 890, location: 'Nha Trang', joinDate: '2025-03-10', verified: true },
  dapper_dan: { fullName: 'Võ Đức Anh', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', bio: 'Smart casual | Korean fashion fan', followers: 950, following: 310, location: 'Ho Chi Minh City', joinDate: '2025-08-05', verified: false },
  sporty_mai: { fullName: 'Đặng Mai Chi', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop', bio: 'Fitness & fashion | Athleisure is my thing 💪', followers: 1800, following: 560, location: 'Ho Chi Minh City', joinDate: '2025-05-22', verified: false },
};

export function UserPublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const profile = username ? userProfiles[username] : null;
  const [isFollowing, setIsFollowing] = useState(false);
  const { v, lang } = useLanguage();

  const userPosts = ootdPosts.filter(p => p.user.username === username);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center">
          <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', textTransform: 'uppercase' as const }}>{v('User not found', 'Không tìm thấy người dùng')}</p>
          <Link to="/ootd" className="px-6 py-3 bg-[#d41c1c] text-white inline-block hover:bg-[#b01818] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #d41c1c' }}>{v('Back to Feed', 'Quay lại bảng tin')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link to="/ootd" className="inline-flex items-center gap-2 mb-6 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <ArrowLeft className="w-4 h-4" />{v('Back to Feed', 'Quay lại bảng tin')}
        </Link>

        {/* Profile Header */}
        <div className="bg-white p-6 sm:p-8 mb-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <ImageWithFallback src={profile.avatar} alt={profile.fullName} className="w-28 h-28 rounded-full object-cover" style={{ border: '3px solid #e2b93b' } as any} />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>{profile.fullName}</h1>
                {profile.verified && <BadgeCheck className="w-6 h-6 text-blue-500" />}
              </div>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>@{username}</p>
              <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '12px' }}>{profile.bio}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4" style={{ fontSize: '13px', color: '#888' }}>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{v('Joined', 'Tham gia')} {new Date(profile.joinDate).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-6 mb-4">
                <div><span style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}>{userPosts.length}</span><span style={{ fontSize: '13px', color: '#888', marginLeft: '4px' }}>{v('posts', 'bài viết')}</span></div>
                <div><span style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}>{profile.followers.toLocaleString()}</span><span style={{ fontSize: '13px', color: '#888', marginLeft: '4px' }}>{v('followers', 'người theo dõi')}</span></div>
                <div><span style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}>{profile.following}</span><span style={{ fontSize: '13px', color: '#888', marginLeft: '4px' }}>{v('following', 'đang theo dõi')}</span></div>
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-2 px-6 py-2.5 transition-colors ${
                  isFollowing ? 'bg-white text-[#d41c1c] border-2 border-[#d41c1c]' : 'bg-[#d41c1c] text-white border-2 border-[#d41c1c]'
                }`}
                style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                <UserPlus className="w-4 h-4" />
                {isFollowing ? v('Following', 'Đang theo dõi') : v('Follow', 'Theo dõi')}
              </button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="flex items-center gap-2 mb-6">
          <Grid3X3 className="w-5 h-5" style={{ color: '#e2b93b' }} />
          <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Posts', 'Bài viết')}</h2>
        </div>

        {userPosts.length === 0 ? (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', textTransform: 'uppercase' as const }}>{v('No posts yet', 'Chưa có bài viết')}</p>
            <p style={{ fontSize: '14px', color: '#888' }}>{v("This user hasn't shared any OOTDs", 'Người dùng này chưa chia sẻ OOTD nào')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userPosts.map(post => (
              <Link key={post.id} to={`/ootd/${post.id}`} className="group relative overflow-hidden aspect-square" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
                <ImageWithFallback src={post.image} alt={v(post.caption, post.captionVi)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-5 h-5 fill-white" />
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{post.comments.length}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}