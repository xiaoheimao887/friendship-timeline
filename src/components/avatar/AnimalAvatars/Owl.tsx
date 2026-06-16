interface Props { size: number; color: string; secondaryColor: string; }
export function Owl({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="55" rx="30" ry="28" fill={color} />
      <polygon points="22,40 28,12 38,30" fill={color} />
      <polygon points="78,40 72,12 62,30" fill={color} />
      <circle cx="35" cy="48" r="14" fill="white" />
      <circle cx="65" cy="48" r="14" fill="white" />
      <circle cx="35" cy="48" r="8" fill="#333" />
      <circle cx="65" cy="48" r="8" fill="#333" />
      <circle cx="37" cy="46" r="3" fill="white" />
      <circle cx="67" cy="46" r="3" fill="white" />
      <polygon points="50,58 47,64 53,64" fill="#FF9E00" />
      <ellipse cx="50" cy="72" rx="18" ry="8" fill={secondaryColor} />
    </svg>
  );
}
