// src/components/BrandMark.jsx
import { useState } from "react";
import LogoCarogna from "./LogoCarogna";

export default function BrandMark({
  size = 32,
  className = "",
  rounded = "rounded-xl",
  withRing = true,
  alt = "Carogna League",
}) {
  const [err, setErr] = useState(false);
  const ring = withRing ? "ring-1 ring-black/5 dark:ring-white/10" : "";

  if (err) return <LogoCarogna size={size} />;

  return (
    <img
      src="/carognaleague.png"
      width={size}
      height={size}
      alt={alt}
      className={`${rounded} ${ring} shadow-sm object-contain ${className}`}
      style={{ width: size, height: size }}
      onError={() => setErr(true)}
    />
  );
}

