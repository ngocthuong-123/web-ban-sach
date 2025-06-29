// src/app/components/ZaloIcon.tsx
import React from "react";

interface ZaloIconProps {
  className?: string;
  style?: React.CSSProperties;
}

const ZaloIcon: React.FC<ZaloIconProps> = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="32" fill="#0180DE"/>
    <g>
      <text x="17" y="40" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="22" fill="#fff">Zalo</text>
    </g>
  </svg>
);

export default ZaloIcon;
