import type { BuildingVariant } from "../config/building-art.config";

interface BuildingArtProps {
  variant: BuildingVariant;
  color: string;
  name: string;
}

function shade(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * A small illustrated building, self-contained SVG (no external image
 * assets). Shape details vary by `variant` so the 12 apps don't all
 * look identical, while sharing the same construction (sign/facade/
 * windows/trees/ground) for visual consistency.
 */
function BuildingArt({ variant, color, name }: BuildingArtProps) {
  const dark = shade(color, -40);
  const light = shade(color, 40);
  const glass = "#BFE3F2";

  return (
    <svg viewBox="0 0 220 160" className="h-full w-full">
      {/* sky */}
      <rect x="0" y="0" width="220" height="160" fill="#EAF4FB" />
      <circle cx="30" cy="24" r="10" fill="#FFFFFF" opacity="0.8" />
      <circle cx="45" cy="28" r="7" fill="#FFFFFF" opacity="0.8" />
      <circle cx="185" cy="20" r="8" fill="#FFFFFF" opacity="0.7" />

      {/* ground */}
      <rect x="0" y="140" width="220" height="20" fill="#CDEBD3" />

      {/* trees */}
      <g>
        <rect x="18" y="118" width="4" height="22" fill="#8B5E3C" />
        <circle cx="20" cy="112" r="14" fill="#5FA35C" />
      </g>
      <g>
        <rect x="196" y="122" width="4" height="18" fill="#8B5E3C" />
        <circle cx="198" cy="116" r="12" fill="#6BB86A" />
      </g>

      {/* ===== building ===== */}
      {variant === "cafe" && (
        <>
          <rect x="45" y="70" width="130" height="70" rx="4" fill={color} />
          <rect x="45" y="70" width="130" height="14" fill={dark} />
          <rect x="40" y="58" width="140" height="16" rx="3" fill={light} />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={62 + i * 34}
              y={92}
              width={22}
              height={22}
              rx={2}
              fill={glass}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
          <rect x="98" y="116" width="24" height="24" fill={dark} />
        </>
      )}

      {variant === "kitchen" && (
        <>
          <rect x="45" y="65" width="130" height="75" fill={color} />
          <polygon points="40,65 180,65 160,45 60,45" fill={dark} />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={60 + i * 36}
              y={86}
              width={22}
              height={22}
              rx={2}
              fill={glass}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
          <rect x="98" y="116" width="24" height="24" fill={dark} />
        </>
      )}

      {variant === "tower" && (
        <>
          <rect x="60" y="30" width="100" height="110" fill={color} />
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 3 }).map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={72 + col * 28}
                y={42 + row * 18}
                width={16}
                height={12}
                fill={glass}
                opacity={0.9}
              />
            )),
          )}
          <rect x="98" y="116" width="24" height="24" fill={dark} />
        </>
      )}

      {variant === "diner" && (
        <>
          <rect x="40" y="72" width="140" height="68" fill={color} />
          {Array.from({ length: 7 }).map((_, i) => (
            <polygon
              key={i}
              points={`${40 + i * 20},72 ${50 + i * 20},72 ${45 + i * 20},58`}
              fill={i % 2 === 0 ? dark : "#fff"}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={58 + i * 36}
              y={94}
              width={22}
              height={20}
              rx={2}
              fill={glass}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
          <rect x="96" y="116" width="28" height="24" fill={dark} />
        </>
      )}

      {variant === "storefront" && (
        <>
          <rect x="45" y="60" width="130" height="80" fill={color} />
          <rect x="55" y="90" width="110" height="40" fill={glass} opacity="0.9" />
          <rect x="45" y="60" width="130" height="10" fill={dark} />
          <rect x="98" y="118" width="24" height="22" fill={dark} />
        </>
      )}

      {variant === "warehouse" && (
        <>
          <rect x="40" y="75" width="140" height="65" fill={color} />
          <polygon points="35,75 185,75 170,58 50,58" fill={dark} />
          {[0, 1].map((i) => (
            <rect
              key={i}
              x={58 + i * 68}
              y={98}
              width={48}
              height={38}
              rx={3}
              fill={dark}
              opacity={0.85}
            />
          ))}
          {[0, 1].map((i) =>
            Array.from({ length: 3 }).map((_, j) => (
              <rect
                key={`${i}-${j}`}
                x={62 + i * 68 + j * 14}
                y={104}
                width={10}
                height={28}
                fill={shade(color, -20)}
              />
            )),
          )}
        </>
      )}

      {variant === "shop" && (
        <>
          <rect x="50" y="68" width="120" height="72" fill={color} />
          <rect x="50" y="68" width="120" height="12" fill={dark} />
          <rect x="64" y="90" width="34" height="30" rx="2" fill={glass} stroke="#fff" strokeWidth="2" />
          <rect x="122" y="90" width="34" height="30" rx="2" fill={glass} stroke="#fff" strokeWidth="2" />
          <rect x="100" y="116" width="20" height="24" fill={dark} />
        </>
      )}

      {variant === "manor" && (
        <>
          <rect x="42" y="68" width="136" height="72" fill={color} />
          <rect x="42" y="68" width="136" height="10" fill={dark} />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${60 + i * 36} 118 v-18 a 9 9 0 0 1 18 0 v18 z`}
              fill={glass}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </>
      )}

      {/* sign */}
      <rect x="55" y="72" width="110" height="16" rx="2" fill="#1E293B" opacity="0.85" />
      <text
        x="110"
        y="83"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#fff"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        {name.toUpperCase()}
      </text>
    </svg>
  );
}

export default BuildingArt;
