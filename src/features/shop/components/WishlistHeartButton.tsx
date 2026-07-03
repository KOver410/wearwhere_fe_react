import { Heart } from 'lucide-react';
import { useLanguage } from '@/shared/i18n/LanguageContext';

/**
 * Heart toggle overlaid on a product card. The accessible name reflects the
 * action that the next click performs (add vs remove), and the fill state
 * reflects current wishlist membership.
 */
export function WishlistHeartButton({
  active,
  onToggle,
  className,
  pending = false,
}: {
  active: boolean;
  onToggle: () => void;
  className?: string;
  /** Disables the button and shows a busy state while a request is in flight. */
  pending?: boolean;
}) {
  const { v } = useLanguage();
  const label = active
    ? v('Remove from wishlist', 'Xóa khỏi danh sách yêu thích')
    : v('Add to wishlist', 'Thêm vào yêu thích');

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      aria-busy={pending}
      disabled={pending}
      title={label}
      onClick={(e) => {
        // Cards wrap content in a Link; don't navigate when toggling.
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={`${
        className ??
        'p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors'
      }${pending ? ' opacity-60 cursor-not-allowed' : ''}`}
    >
      <Heart
        className={`w-4 h-4 ${active ? 'fill-[#E7000B] text-[#E7000B]' : 'text-[#0d0d0d]'}`}
      />
    </button>
  );
}
