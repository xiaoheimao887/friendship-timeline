interface Props { size: number; color: string; secondaryColor: string; }
export function Bear({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="60" r="28" fill={color} />
      <circle cx="24" cy="35" r="16" fill={color} />
      <circle cx="76" cy="35" r="16" fill={color} />
      <circle cx="24" cy="33" r="8" fill={secondaryColor} />
      <circle cx="76" cy="33" r="8" fill={secondaryColor} />
      <ellipse cx="50" cy="68" rx="20" ry="14" fill={secondaryColor} />
      <circle cx="37" cy="52" r="5" fill="#333" />
      <circle cx="63" cy="52" r="5" fill="#333" />
      <circle cx="38.5" cy="50.5" r="2" fill="white" />
      <circle cx="64.5" cy="50.5" r="2" fill="white" />
      <ellipse cx="50" cy="62" rx="7" ry="4" fill="#333" />
      <path d="M44 68 Q50 74 56 68" stroke="#333" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
