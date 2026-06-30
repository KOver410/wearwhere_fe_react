import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Save, X, Plus, Heart, Eye, MoreHorizontal, Tag } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { AccountLayout } from '@/shared/components/AccountLayout';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { ootdPosts } from '@/shared/data/accountMockData';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { updateProfile } from '@/features/auth/api/authApi';
import { ApiError } from '@/shared/api/contracts';

type ProfileFormValues = { name: string; bio: string };

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'tagged'>('posts');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { v } = useLanguage();
  const { user, applyUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: { name: user?.name ?? '', bio: user?.bio ?? '' },
  });
  const myPosts = ootdPosts.filter(p => p.user.id === user?.id);

  // Mock tagged products count
  const taggedProductsCount = myPosts.reduce((sum, p) => sum + p.products.length, 0);

  // Mock view counts for posts
  const viewCounts = [52000, 32000, 26000, 56000, 18000, 41000, 9500, 23000];

  const openEditor = () => {
    reset({ name: user?.name ?? '', bio: user?.bio ?? '' });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const { user: updated } = await updateProfile({ name: data.name, bio: data.bio });
      applyUser(updated);
      toast.success(v('Profile updated', 'Đã cập nhật hồ sơ'));
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof ApiError && error.code === 'VALIDATION_FAILED'
          ? v('Please check your name and bio.', 'Vui lòng kiểm tra tên và giới thiệu.')
          : error instanceof Error
            ? error.message
            : v('Could not update profile', 'Không thể cập nhật hồ sơ');
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(0).replace(/\.0$/, '')} nghìn`;
    return count.toString();
  };

  return (
    <AccountLayout>
      <div>
        {/* KREAM-style Profile Header */}
        <div className="flex items-start gap-6 sm:gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <ImageWithFallback
              src={user?.avatar_url ?? undefined}
              alt={user?.name ?? ''}
              className="w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-full object-cover"
              style={{ border: '3px solid #e0d8cf' } as any}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            {/* Username + Edit + More */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 style={{
                fontSize: '22px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                color: '#0d0d0d',
                lineHeight: 1.2,
              }}>
                {user?.name}
              </h1>
              <button
                onClick={openEditor}
                className="px-4 py-1.5 transition-colors hover:bg-[#0d0d0d] hover:text-white"
                style={{
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '2px solid #0d0d0d',
                  color: '#0d0d0d',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {v('Edit Profile', 'Sửa hồ sơ')}
              </button>
              <button
                className="p-1.5 hover:bg-[#f5f0ea] transition-colors"
                style={{ borderRadius: '50%' }}
                onClick={() => setShowMoreMenu(true)}
              >
                <MoreHorizontal className="w-5 h-5" style={{ color: '#0d0d0d' }} />
              </button>

              {/* Instagram-style centered modal */}
              {showMoreMenu && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <div className="absolute inset-0 bg-black/60" onClick={() => setShowMoreMenu(false)} />
                  <div className="relative bg-white w-full max-w-[400px] overflow-hidden" style={{ borderRadius: '14px' }}>
                    {[
                      { label: v('Block', 'Chặn'), color: '#d41c1c', weight: 700 },
                      { label: v('Restrict', 'Hạn chế'), color: '#d41c1c', weight: 700 },
                      { label: v('Report', 'Báo cáo'), color: '#d41c1c', weight: 700 },
                      { label: v('Share to...', 'Chia sẻ lên...'), color: '#0d0d0d', weight: 500 },
                      { label: v('About this account', 'Giới thiệu về tài khoản này'), color: '#0d0d0d', weight: 500 },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setShowMoreMenu(false)}
                        className="w-full py-3.5 text-center transition-colors hover:bg-[#f5f0ea]"
                        style={{
                          fontSize: '14px',
                          fontWeight: item.weight,
                          color: item.color,
                          borderBottom: '1px solid #e0d8cf',
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowMoreMenu(false)}
                      className="w-full py-3.5 text-center transition-colors hover:bg-[#f5f0ea]"
                      style={{ fontSize: '14px', fontWeight: 500, color: '#0d0d0d' }}
                    >
                      {v('Cancel', 'Hủy')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            {user?.bio && (
              <p style={{
                fontSize: '14px',
                color: '#4a4a4a',
                lineHeight: '1.5',
                fontFamily: "'Montserrat', sans-serif",
              }}>
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Tab Navigation — KREAM style */}
        <div className="flex" style={{ borderBottom: '1px solid #e0d8cf' }}>
          <button
            onClick={() => setActiveTab('posts')}
            className="flex-1 sm:flex-none px-6 py-3 transition-colors relative"
            style={{
              fontSize: '14px',
              fontWeight: activeTab === 'posts' ? 700 : 500,
              color: activeTab === 'posts' ? '#0d0d0d' : '#888',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {v('Posts', 'Bài đăng')} <span style={{ fontWeight: 700, marginLeft: '4px' }}>{myPosts.length}</span>
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: '#0d0d0d' }} />
            )}
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className="flex-1 sm:flex-none px-6 py-3 transition-colors relative"
            style={{
              fontSize: '14px',
              fontWeight: activeTab === 'tagged' ? 700 : 500,
              color: activeTab === 'tagged' ? '#0d0d0d' : '#888',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {v('Tagged Products', 'Gắn thẻ sản phẩm')} <span style={{ fontWeight: 700, marginLeft: '4px' }}>{taggedProductsCount}</span>
            {activeTab === 'tagged' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: '#0d0d0d' }} />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' ? (
          <div className="pt-4">
            {myPosts.length === 0 ? (
              <div className="text-center py-16" style={{ backgroundColor: '#fefcfa', borderRadius: '10px', border: '2px dashed #e0d8cf' }}>
                <Camera className="w-12 h-12 mx-auto mb-3" style={{ color: '#e0d8cf' }} />
                <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {v('No style posts yet', 'Chưa có bài viết')}
                </p>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                  {v('Share your first outfit of the day!', 'Chia sẻ bộ trang phục đầu tiên!')}
                </p>
                <Link
                  to="/ootd/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #d41c1c' }}
                >
                  <Plus className="w-4 h-4" />
                  {v('Create Your First Post', 'Tạo bài viết đầu tiên')}
                </Link>
              </div>
            ) : (
              <>
                {/* New Post button */}
                <div className="flex justify-end mb-2">
                  <Link
                    to="/ootd/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
                    style={{ borderRadius: '10px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {v('New Post', 'Tạo mới')}
                  </Link>
                </div>

                {/* KREAM-style Post Grid — varying heights */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {myPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      to={`/ootd/${post.id}`}
                      className="group block"
                    >
                      {/* Image Container — varying aspect ratios like KREAM */}
                      <div
                        className="relative overflow-hidden"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: '#f3f0eb',
                          aspectRatio: index % 3 === 0 ? '3/4' : index % 3 === 1 ? '3/4.5' : '3/3.8',
                        }}
                      >
                        <ImageWithFallback
                          src={post.image}
                          alt={post.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Video play icon for some posts (like KREAM) */}
                        {index % 3 === 1 && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white ml-0.5" />
                          </div>
                        )}
                        {/* View count overlay — bottom left */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px' }}>
                          <Eye className="w-3 h-3 text-white" />
                          <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}>
                            {formatViewCount(viewCounts[index % viewCounts.length])}
                          </span>
                        </div>
                      </div>

                      {/* User info + Like count below card — KREAM style */}
                      <div className="flex items-center justify-between mt-2.5 px-0.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <ImageWithFallback
                            src={post.user.avatar}
                            alt={post.user.username}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                          <span className="truncate" style={{
                            fontSize: '13px',
                            color: '#0d0d0d',
                            fontWeight: 500,
                            fontFamily: "'Montserrat', sans-serif",
                          }}>
                            {post.user.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Heart className="w-3.5 h-3.5" style={{ color: '#ccc' }} />
                          <span style={{ fontSize: '13px', color: '#888', fontFamily: "'Montserrat', sans-serif" }}>
                            {post.likes}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Tagged Products Tab */
          <div className="pt-4">
            {myPosts.length === 0 || taggedProductsCount === 0 ? (
              <div className="text-center py-16" style={{ backgroundColor: '#fefcfa', borderRadius: '10px', border: '2px dashed #e0d8cf' }}>
                <Tag className="w-12 h-12 mx-auto mb-3" style={{ color: '#e0d8cf' }} />
                <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {v('No tagged products', 'Chưa gắn thẻ sản phẩm')}
                </p>
                <p style={{ fontSize: '13px', color: '#888' }}>
                  {v('Tag products in your OOTD posts to show them here', 'Gắn thẻ sản phẩm trong bài OOTD để hiển thị ở đây')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {myPosts.flatMap(post =>
                  post.products.map(product => (
                    <Link
                      key={`${post.id}-${product.id}`}
                      to={`/product/${product.id}`}
                      className="group block"
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{ borderRadius: '4px', backgroundColor: '#f3f0eb', aspectRatio: '1/1' }}
                      >
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-2 px-0.5">
                        <p style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Montserrat', sans-serif" }}>
                          {product.brand}
                        </p>
                        <p className="truncate" style={{ fontSize: '13px', color: '#0d0d0d', fontWeight: 500, marginTop: '2px', fontFamily: "'Montserrat', sans-serif" }}>
                          {product.name}
                        </p>
                        <p style={{ fontSize: '14px', color: '#0d0d0d', fontWeight: 700, marginTop: '4px', fontFamily: "'Montserrat', sans-serif" }}>
                          ${product.price}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white"
              style={{ borderRadius: '14px', boxShadow: '0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)' }}
            >
              <div className="sticky top-0 z-10 bg-white px-6 py-5 flex items-center justify-between" style={{ borderBottom: '2px solid #e0d8cf' }}>
                <h2 style={{ fontSize: '22px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>
                  {v('Edit Profile', 'Sửa hồ sơ')}
                </h2>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2 hover:bg-[#fff9f2] transition-colors"
                  style={{ borderRadius: '50%' }}
                >
                  <X className="w-5 h-5 text-[#4a4a4a]" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <ImageWithFallback
                      src={user?.avatar_url ?? undefined}
                      alt={user?.name ?? ''}
                      className="w-20 h-20 rounded-full object-cover"
                      style={{ border: '3px solid #e0d8cf' } as any}
                    />
                    <button
                      type="button"
                      onClick={() => alert(v('Avatar upload coming soon!', 'Tính năng tải ảnh đại diện sắp ra mắt!'))}
                      className="absolute inset-0 w-20 h-20 rounded-full bg-black/40 flex items-center justify-center cursor-pointer transition-opacity opacity-0 hover:opacity-100"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Profile Photo', 'Ảnh đại diện')}</p>
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{v('Click to change your photo', 'Nhấn để đổi ảnh')}</p>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e0d8cf, transparent)' }} />

                <div>
                  <p className="mb-4" style={{ fontSize: '11px', fontWeight: 700, color: '#d41c1c', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Oswald', sans-serif" }}>
                    {v('Personal Information', 'Thông tin cá nhân')}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="profile-name" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>
                        {v('Full Name', 'Họ và tên')}
                      </label>
                      <input
                        id="profile-name"
                        type="text"
                        {...register('name', {
                          required: v('Name is required', 'Tên là bắt buộc'),
                          maxLength: { value: 120, message: v('Name is too long', 'Tên quá dài') },
                        })}
                        className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                        style={{ borderRadius: '10px', fontSize: '14px', color: '#0d0d0d', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }}
                      />
                      {errors.name && <p className="mt-1" style={{ fontSize: '12px', color: '#d41c1c' }}>{errors.name.message as string}</p>}
                    </div>
                    <div>
                      <label htmlFor="profile-bio" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>
                        {v('Bio', 'Giới thiệu')}
                      </label>
                      <textarea
                        id="profile-bio"
                        {...register('bio', {
                          maxLength: { value: 500, message: v('Bio must be 500 characters or fewer', 'Giới thiệu tối đa 500 ký tự') },
                        })}
                        className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors resize-none"
                        style={{ borderRadius: '10px', fontSize: '14px', color: '#0d0d0d', minHeight: '80px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }}
                      />
                      {errors.bio && <p className="mt-1" style={{ fontSize: '12px', color: '#d41c1c' }}>{errors.bio.message as string}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: '2px solid #e0d8cf' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 transition-colors hover:bg-[#fff9f2]"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #e0d8cf', color: '#4a4a4a' }}
                >
                  {v('Cancel', 'Hủy')}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors disabled:opacity-60"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? v('Saving...', 'Đang lưu...') : v('Save Changes', 'Lưu thay đổi')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
