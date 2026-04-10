import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const iconSize = { sm: 20, md: 28, lg: 36 }[size];
  const fontSize = { sm: 16, md: 22, lg: 28 }[size];

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        style={{ display: 'block', flexShrink: 0 }}
        aria-hidden="true"
      />
      <span
        style={{
          fontFamily: 'var(--font-family-heading)',
          fontSize,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          color: 'currentColor',
          lineHeight: 1,
        }}
      >
        Label
      </span>
    </span>
  );
}
