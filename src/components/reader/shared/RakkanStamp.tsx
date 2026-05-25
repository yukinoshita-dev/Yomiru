interface RakkanStampProps {
  size?: number;
  color?: string;
  label?: string;
  className?: string;
}

export function RakkanStamp({
  size = 56,
  color = "#a8453a",
  label = "讀",
  className,
}: RakkanStampProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      className={className}
      style={{ display: "block" }}
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="52"
        height="52"
        rx="2"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        opacity="0.95"
      />
      <rect x="2" y="2" width="52" height="52" rx="2" fill={color} opacity="0.08" />
      <text
        x="28"
        y="38"
        textAnchor="middle"
        fontFamily="'Shippori Mincho', serif"
        fontSize="30"
        fill={color}
        fontWeight={600}
      >
        {label}
      </text>
      <rect x="4" y="20" width="2" height="14" fill={color} opacity="0.5" />
    </svg>
  );
}
