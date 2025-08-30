// src/components/LogoCarogna.jsx
export default function LogoCarogna({ size = 32 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-label="Carogna League">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a4aa3"/>
          <stop offset="100%" stopColor="#0bb36f"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#g)" />
      <circle cx="24" cy="24" r="10" fill="white" opacity="0.95"/>
      <text x="24" y="28" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0a4aa3">CL</text>
    </svg>
  );
}

