interface Props { size: number; color: string; secondaryColor: string; }
export function Lion({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="58" rx="32" ry="28" fill={color} />
      <circle cx="24" cy="28" r="12" fill={color} opacity="0.6" />
      <circle cx="76" cy="28" r="12" fill={color} opacity="0.6" />
      <circle cx="18" cy="24" r="8" fill={color} opacity="0.4" />
      <circle cx="82" cy="24" r="8" fill={color} opacity="0.4" />
      <ellipse cx="50" cy="65" rx="22" ry="14" fill={secondaryColor} />
      <circle cx="34" cy="48" r="5" fill="#333" />
      <circle cx="66" cy="48" r="5" fill="#333" />
      <circle cx="35.5" cy="46.5" r="2" fill="white" />
      <circle cx="67.5" cy="46.5" r="2" fill="white" />
      <ellipse cx="50" cy="58" rx="8" ry="5" fill="#FF9E9E" />
      <path d="M44 64 Q50 70 56 64" stroke="#333" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
