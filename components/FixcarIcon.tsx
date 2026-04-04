// 📁 저장 경로: components/FixcarIcon.tsx
'use client';

/**
 * 픽스카 커스텀 아이콘 (10개만 커스텀, 나머지는 기존 이모지)
 * 커스텀: 🏪📁📋⚠⚙🔍🧮🌍⛽🏆
 */

interface FixcarIconProps {
  emoji: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface IconDef {
  color: string;
  svg: string;
}

const CUSTOM_ICONS: Record<string, IconDef> = {
  '🏪': {
    color: '#0066FF',
    svg: `<rect x="2" y="8.5" width="16" height="9" rx="1" fill="none" stroke="#fff" stroke-width="1.1"/>
      <path d="M3 8.5L4.5 4h11L17 8.5" fill="none" stroke="#fff" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M3 8.5c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2" fill="none" stroke="#fff" stroke-width="1.1"/>
      <rect x="8" y="13" width="4" height="4.5" rx=".5" fill="none" stroke="#fff" stroke-width="1"/>
      <path d="M8 15h4" stroke="#fff" stroke-width=".6"/>`,
  },
  '📁': {
    color: '#FF3B1E',
    svg: `<path d="M3 5.5A1 1 0 014 4.5h4l2 2h6a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1z" fill="none" stroke="#fff" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M3 9h14" stroke="#fff" stroke-width=".7"/>`,
  },
  '📋': {
    color: '#555',
    svg: `<rect x="4.5" y="5" width="11" height="12.5" rx="1.2" fill="none" stroke="#fff" stroke-width="1.1"/>
      <rect x="7" y="2.5" width="6" height="3.5" rx=".8" fill="none" stroke="#fff" stroke-width="1.1"/>
      <path d="M7 9.5h6M7 12h6M7 14.5h3.5" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>`,
  },
  '⚠': {
    color: '#ECC94B',
    svg: `<path d="M10 3L2.5 16.5h15z" fill="none" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M10 8v3.5" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
      <circle cx="10" cy="14" r=".8" fill="#fff"/>`,
  },
  '⚙': {
    color: '#888',
    svg: `<circle cx="10" cy="10" r="2.8" fill="none" stroke="#fff" stroke-width="1.1"/>
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>`,
  },
  '🔍': {
    color: '#555',
    svg: `<circle cx="8.5" cy="8.5" r="5" fill="none" stroke="#fff" stroke-width="1.2"/>
      <path d="M12.5 12.5l4 4" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>`,
  },
  '🧮': {
    color: '#555',
    svg: `<rect x="3.5" y="2.5" width="13" height="15" rx="1.5" fill="none" stroke="#fff" stroke-width="1.1"/>
      <rect x="5.5" y="4.5" width="9" height="3" rx=".5" fill="none" stroke="#fff" stroke-width=".8"/>
      <circle cx="6.5" cy="11" r=".8" fill="#fff"/><circle cx="10" cy="11" r=".8" fill="#fff"/><circle cx="13.5" cy="11" r=".8" fill="#fff"/>
      <circle cx="6.5" cy="14" r=".8" fill="#fff"/><circle cx="10" cy="14" r=".8" fill="#fff"/>
      <rect x="12.5" y="12.5" width="2" height="3.5" rx=".5" fill="none" stroke="#fff" stroke-width=".7"/>`,
  },
  '🌍': {
    color: '#48BB78',
    svg: `<circle cx="10" cy="10" r="7.5" fill="none" stroke="#fff" stroke-width="1.1"/>
      <ellipse cx="10" cy="10" rx="3" ry="7.5" fill="none" stroke="#fff" stroke-width=".9"/>
      <path d="M2.5 10h15M3.5 6h13M3.5 14h13" stroke="#fff" stroke-width=".7"/>`,
  },
  '⛽': {
    color: '#555',
    svg: `<rect x="3" y="4" width="9" height="13" rx="1" fill="none" stroke="#fff" stroke-width="1.1"/>
      <path d="M12 7.5h2.5a1.5 1.5 0 011.5 1.5v5.5a1 1 0 01-2 0V12" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="round"/>
      <rect x="5" y="6.5" width="5" height="3.5" rx=".5" fill="none" stroke="#fff" stroke-width=".8"/>
      <path d="M5.5 4V2.5h4V4" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>`,
  },
  '🏆': {
    color: '#ECC94B',
    svg: `<path d="M5 2.5h10v6a5 5 0 01-10 0z" fill="none" stroke="#fff" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M5 4H3v2.5a2.5 2.5 0 002.5 2.5M15 4h2v2.5a2.5 2.5 0 01-2.5 2.5" fill="none" stroke="#fff" stroke-width=".9"/>
      <path d="M8 14h4M10 13v1.5" stroke="#fff" stroke-width="1" stroke-linecap="round"/>
      <rect x="7" y="15.5" width="6" height="2" rx=".5" fill="none" stroke="#fff" stroke-width=".9"/>`,
  },
};

export default function FixcarIcon({ emoji, size = 16, className, style }: FixcarIconProps) {
  const custom = CUSTOM_ICONS[emoji];

  // 커스텀 아이콘 없으면 기존 이모지 렌더링
  if (!custom) {
    return (
      <span
        className={className}
        style={{ fontSize: size, lineHeight: 1, display: 'inline-block', verticalAlign: 'middle', ...style }}
      >
        {emoji}
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <rect width="20" height="20" rx="5" fill={custom.color} />
      <g dangerouslySetInnerHTML={{ __html: custom.svg }} />
    </svg>
  );
}

export const CUSTOM_EMOJI_LIST = Object.keys(CUSTOM_ICONS);
export function hasCustomIcon(emoji: string): boolean {
  return emoji in CUSTOM_ICONS;
}
