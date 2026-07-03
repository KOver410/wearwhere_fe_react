import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { createPost } from '@/features/ootd/api/ootdApi';

type Selected = { file: File; preview: string };

export function OOTDCreatePage() {
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { isLoggedIn, promptLogin } = useAuth();
  const [caption, setCaption] = useState('');
  const [photos, setPhotos] = useState<Selected[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track the latest selection so the unmount cleanup revokes the actual object
  // URLs (an empty-deps effect would otherwise capture the initial empty list).
  const photosRef = useRef<Selected[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => {
    return () => {
      photosRef.current.forEach(p => URL.revokeObjectURL(p.preview));
    };
  }, []);

  const onFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const picked = Array.from(fileList).map(file => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos(prev => [...prev, ...picked]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (submitting || photos.length === 0 || !caption.trim()) return;
    if (!isLoggedIn) {
      promptLogin('/ootd/create');
      return;
    }
    setSubmitting(true);
    try {
      const { id } = await createPost({ photos: photos.map(p => p.file), caption: caption.trim() });
      navigate(`/ootd/${id}`);
    } catch {
      alert(v('Could not post your OOTD. Please try again.', 'Không thể đăng OOTD. Vui lòng thử lại.'));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link to="/ootd" className="inline-flex items-center gap-2 mb-6 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <ArrowLeft className="w-4 h-4" />{v('Back to Feed', 'Quay lại bảng tin')}
        </Link>

        <h1 style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>{v('Share Your OOTD', 'Chia sẻ OOTD của bạn')}</h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>{v('Show off your outfit and inspire the community', 'Khoe trang phục và truyền cảm hứng cho cộng đồng')}</p>

        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white p-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5" style={{ color: '#d41c1c' }} />
              <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Photos', 'Ảnh')}</h2>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              aria-label={v('Upload photos', 'Tải ảnh lên')}
              onChange={e => onFilesSelected(e.target.files)}
            />

            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {photos.map((p, i) => (
                  <div key={p.preview} className="relative">
                    <ImageWithFallback src={p.preview} alt={`Preview ${i + 1}`} className="w-full aspect-square object-cover" style={{ borderRadius: '10px' } as any} />
                    <button onClick={() => removePhoto(i)} aria-label="remove photo" className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 border-2 border-dashed border-[#e0d8cf] hover:border-[#e2b93b] transition-colors text-center cursor-pointer"
              style={{ borderRadius: '10px' }}
            >
              <Upload className="w-10 h-10 mx-auto text-[#888] mb-3" />
              <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '4px', textTransform: 'uppercase' as const }}>{v('Upload your outfit photos', 'Tải ảnh trang phục lên')}</p>
              <p style={{ fontSize: '14px', color: '#888' }}>{v('JPG, PNG. Recommended: portrait orientation', 'JPG, PNG. Khuyến nghị: ảnh dọc')}</p>
            </button>
          </div>

          {/* Caption */}
          <div className="bg-white p-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Caption', 'Mô tả')}</h2>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder={v('Tell us about your outfit...', 'Kể về trang phục của bạn...')}
              className="w-full px-4 py-3 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors resize-none"
              style={{ borderRadius: '10px', fontSize: '14px', minHeight: '120px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
              maxLength={2000}
            />
            <p className="text-right mt-1" style={{ fontSize: '12px', color: '#888' }}>{caption.length}/2000</p>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={photos.length === 0 || !caption.trim() || submitting}
              className="flex-1 py-3.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors disabled:bg-[#e0d8cf] disabled:cursor-not-allowed"
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid transparent' }}
            >
              {submitting ? v('Posting...', 'Đang đăng...') : v('Post OOTD', 'Đăng OOTD')}
            </button>
            <button
              onClick={() => navigate('/ootd')}
              className="px-6 py-3.5 border-2 border-[#d41c1c] hover:bg-[#f3f0eb] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {v('Cancel', 'Hủy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
