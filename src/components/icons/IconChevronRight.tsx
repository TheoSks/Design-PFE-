import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

const IconChevronRight: React.FC<IconProps> = ({
  size = 20,
  className,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default IconChevronRight;
