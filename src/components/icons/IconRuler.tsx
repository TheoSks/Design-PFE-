import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export default function IconRuler({ size = 20, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M21.3 15.3L15.3 21.3C15.1 21.5 14.8 21.5 14.6 21.3L2.7 9.4C2.5 9.2 2.5 8.9 2.7 8.7L8.7 2.7C8.9 2.5 9.2 2.5 9.4 2.7L21.3 14.6C21.5 14.8 21.5 15.1 21.3 15.3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 10.5L10.5 13.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 7.5L12.5 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 10.5L15.5 12.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
