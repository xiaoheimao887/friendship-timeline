interface Props {
  size: number;
  color: string;
  secondaryColor: string;
}

export function Cat({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="62" rx="28" ry="26" fill={color} />
      <polygon points="26,40 18,15 38,32" fill={color} />
      <polygon points="74,40 82,15 62,32" fill={color} />
      <polygon points="28,38 22,20 37,33" fill={secondaryColor} />
      <polygon points="72,38 78,20 63,33" fill={secondaryColor} />
      <ellipse cx="50" cy="68" rx="20" ry="14" fill={secondaryColor} />
      <circle cx="38" cy="54" r="4.5" fill="#333" />
      <circle cx="62" cy="54" r="4.5" fill="#333" />
      <circle cx="39.5" cy="52.5" r="1.5" fill="white" />
      <circle cx="63.5" cy="52.5" r="1.5" fill="white" />
      <polygon points="50,60 47,65 53,65" fill="#FF9E9E" />
      <path d="M44 67 Q50 72 56 67" stroke="#333" strokeWidth="1.5" fill="none" />
      <line x1="18" y1="60" x2="36" y2="63" stroke="#666" strokeWidth="1" opacity="0.5" />
      <line x1="18" y1="65" x2="36" y2="65" stroke="#666" strokeWidth="1" opacity="0.5" />
      <line x1="64" y1="63" x2="82" y2="60" stroke="#666" strokeWidth="1" opacity="0.5" />
      <line x1="64" y1="65" x2="82" y2="65" stroke="#666" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
