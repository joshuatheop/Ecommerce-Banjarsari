import React from "react";

interface ThumbProps {
  color?: string;
  label: string;
  aspect?: string;
}

export default function Thumb({ color = "#05472B", label, aspect = "4/3" }: ThumbProps) {
  return (
    <div className="thumb" style={{ aspectRatio: aspect, background: color, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: `repeating-linear-gradient(135deg, transparent 0 14px, rgba(255, 255, 255, 0.08) 14px 28px)`,
      }}></div>
      <div style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: "rgba(255, 255, 255, 0.8)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontWeight: 600,
        backgroundColor: "rgba(1, 48, 32, 0.6)",
        padding: "3px 8px",
        borderRadius: "4px",
      }}>{label}</div>
    </div>
  );
}
