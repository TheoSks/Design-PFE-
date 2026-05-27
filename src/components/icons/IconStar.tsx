import React from "react";

interface IconStarProps {
  size?: number;
  className?: string;
  color?: string;
  filled?: boolean;
}

const IconStar: React.FC<IconStarProps> = ({
  size = 20,
  className,
  color = "currentColor",
  filled = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
  </svg>
);

export default IconStar;
