import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const iconSize = { sm: 80, md: 96, lg: 112 }[size];

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Label"
        width={iconSize}
        height={iconSize}
        style={{ display: 'block' }}
      />
    </span>
  );
}
