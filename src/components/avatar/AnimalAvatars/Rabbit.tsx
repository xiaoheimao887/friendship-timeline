interface Props { size: number; color: string; secondaryColor: string; }
export function Rabbit({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="62" rx="26" ry="24" fill={color} />
      <ellipse cx="35" cy="22" rx="10" ry="18" fill={color} />
      <ellipse cx="65" cy="22" rx="10" ry="18" fill={color} />
      <ellipse cx="35" cy="18" rx="6" ry="10" fill={secondaryColor} />
      <ellipse cx="65" cy="18" rx="6" ry="10" fill={secondaryColor} />
      <ellipse cx="50" cy="68" rx="18" ry="12" fill={secondaryColor} />
      <circle cx="38" cy="54" r="4" fill="#333" />
      <circle cx="62" cy="54" r="4" fill="#333" />
      <circle cx="39.5" cy="52.5" r="1.5" fill="white" />
      <circle cx="63.5" cy="52.5" r="1.5" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="3" fill="#FF9E9E" />
      <path d="M45 67 Q50 71 55 67" stroke="#333" strokeWidth="1.5" fill="none" />
      <line x1="30" y1="60" x2="20" y2="57" stroke="#666" strokeWidth="1" opacity="0.4" />
      <line x1="30" y1="64" x2="20" y2="64" stroke="#666" strokeWidth="1" opacity="0.4" />
      <line x1="70" y1="60" x2="80" y2="57" stroke="#666" strokeWidth="1" opacity="0.4" />
      <line x1="70" y1="64" x2="80" y2="64" stroke="#666" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
