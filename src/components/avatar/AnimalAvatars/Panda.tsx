interface Props { size: number; color: string; secondaryColor: string; }
export function Panda({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="60" r="30" fill="white" stroke="#555" strokeWidth="2" />
      <circle cx="50" cy="60" r="26" fill={color} />
      <circle cx="22" cy="38" r="16" fill="#555" />
      <circle cx="78" cy="38" r="16" fill="#555" />
      <circle cx="22" cy="38" r="10" fill="#333" />
      <circle cx="78" cy="38" r="10" fill="#333" />
      <circle cx="28" cy="36" r="4" fill="white" />
      <circle cx="72" cy="36" r="4" fill="white" />
      <circle cx="36" cy="52" r="5" fill="#333" />
      <circle cx="64" cy="52" r="5" fill="#333" />
      <circle cx="37.5" cy="50.5" r="2" fill="white" />
      <circle cx="65.5" cy="50.5" r="2" fill="white" />
      <circle cx="50" cy="62" r="4" fill="#333" />
      <ellipse cx="50" cy="70" rx="18" ry="10" fill={secondaryColor} />
    </svg>
  );
}
