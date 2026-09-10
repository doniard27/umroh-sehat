interface CategoryBadgeProps {
  category?: string;
  className?: string;
}

const STYLES: Record<string, { label: string; cls: string }> = {
  HEMAT: { label: '💸 Paket Hemat', cls: 'bg-[#C9A227] text-white' },
  REGULER: { label: '🕋 Paket Reguler', cls: 'bg-[#0B6E4F] text-white' },
  PREMIUM: { label: '👑 Paket Premium', cls: 'bg-purple-600 text-white' },
};

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const style = STYLES[(category || 'REGULER').toUpperCase()] || STYLES.REGULER;
  return (
    <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full shadow ${style.cls} ${className}`}>
      {style.label}
    </span>
  );
}
