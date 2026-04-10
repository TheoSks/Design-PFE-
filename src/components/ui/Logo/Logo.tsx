import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const heights = { sm: 20, md: 28, lg: 36 };
  const h = heights[size];

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <svg
        width={h * 2.5}
        height={h}
        viewBox="0 0 70 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* "Label" wordmark — SF Pro style */}
        <text
          x="0"
          y="22"
          fontFamily="var(--font-family-heading)"
          fontSize="22"
          fontWeight="700"
          letterSpacing="-0.5"
          fill="currentColor"
        >
          Label
        </text>
      </svg>
    </span>
  );
}
