interface Props { size: number; color: string; secondaryColor: string; }
export function Dog({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="62" rx="28" ry="26" fill={color} />
      <ellipse cx="28" cy="35" rx="14" ry="18" fill={color} />
      <ellipse cx="72" cy="35" rx="14" ry="18" fill={color} />
      <ellipse cx="50" cy="68" rx="20" ry="14" fill={secondaryColor} />
      <ellipse cx="28" cy="32" rx="7" ry="9" fill={secondaryColor} />
      <ellipse cx="72" cy="32" rx="7" ry="9" fill={secondaryColor} />
      <circle cx="38" cy="54" r="4.5" fill="#333" />
      <circle cx="62" cy="54" r="4.5" fill="#333" />
      <circle cx="39.5" cy="52.5" r="1.5" fill="white" />
      <circle cx="63.5" cy="52.5" r="1.5" fill="white" />
      <ellipse cx="50" cy="65" rx="8" ry="5" fill="#333" />
      <path d="M44 70 Q50 76 56 70" stroke="#333" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
