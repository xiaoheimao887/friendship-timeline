interface Props { size: number; color: string; secondaryColor: string; }
export function Giraffe({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="40" y="10" width="20" height="60" rx="10" fill={color} />
      <ellipse cx="50" cy="75" rx="22" ry="20" fill={color} />
      <circle cx="50" cy="22" r="6" fill={secondaryColor} />
      <circle cx="42" cy="30" r="4" fill={secondaryColor} />
      <circle cx="58" cy="30" r="4" fill={secondaryColor} />
      <circle cx="50" cy="28" r="6" fill={secondaryColor} />
      <circle cx="42" cy="42" r="4" fill="#333" />
      <circle cx="58" cy="42" r="4" fill="#333" />
      <circle cx="50" cy="70" rx="14" ry="10" fill={secondaryColor} />
      <ellipse cx="50" cy="52" rx="2" ry="2" fill="#FF9E9E" />
      <path d="M47 55 Q50 58 53 55" stroke="#333" strokeWidth="1" fill="none" />
    </svg>
  );
}
