interface Props { size: number; color: string; secondaryColor: string; }
export function Fox({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <polygon points="50,70 15,55 30,20 50,35 70,20 85,55" fill={color} />
      <polygon points="30,20 50,35 40,15" fill={secondaryColor} />
      <polygon points="70,20 50,35 60,15" fill={secondaryColor} />
      <ellipse cx="50" cy="65" rx="20" ry="14" fill="white" opacity="0.7" />
      <circle cx="38" cy="48" r="4.5" fill="#333" />
      <circle cx="62" cy="48" r="4.5" fill="#333" />
      <circle cx="39.5" cy="46.5" r="1.5" fill="white" />
      <circle cx="63.5" cy="46.5" r="1.5" fill="white" />
      <polygon points="50,54 47,59 53,59" fill="#333" />
      <path d="M44 62 Q50 67 56 62" stroke="#333" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
