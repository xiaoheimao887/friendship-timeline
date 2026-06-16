interface Props { size: number; color: string; secondaryColor: string; }
export function Penguin({ size, color, secondaryColor }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="55" rx="28" ry="32" fill="#333" />
      <ellipse cx="50" cy="52" rx="24" ry="26" fill={color} />
      <ellipse cx="50" cy="65" rx="16" ry="16" fill="white" opacity="0.8" />
      <ellipse cx="50" cy="60" rx="12" ry="12" fill={secondaryColor} />
      <circle cx="38" cy="45" r="5" fill="white" />
      <circle cx="62" cy="45" r="5" fill="white" />
      <circle cx="38" cy="45" r="3" fill="#333" />
      <circle cx="62" cy="45" r="3" fill="#333" />
      <polygon points="50,51 48,56 52,56" fill="#FF9E00" />
      <ellipse cx="30" cy="38" rx="6" ry="10" fill="#333" transform="rotate(-15,30,38)" />
      <ellipse cx="70" cy="38" rx="6" ry="10" fill="#333" transform="rotate(15,70,38)" />
      <ellipse cx="50" cy="82" rx="12" ry="6" fill="#FF9E00" opacity="0.6" />
    </svg>
  );
}
