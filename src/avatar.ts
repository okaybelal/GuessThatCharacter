import type { Character } from "./characters";

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  let r = (n >> 16) & 0xff;
  let g = (n >> 8) & 0xff;
  let b = n & 0xff;
  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));
  return `rgb(${r},${g},${b})`;
}

function traitBadge(c: Character): { icon: string; bg: string } | null {
  if (c.alignment === "villain") return { icon: "💀", bg: "#3a1010" };
  if (c.powers === "superpowers" || c.powers === "magic") return { icon: "✨", bg: "#3a2e10" };
  if (c.weapon !== "none") return { icon: "⚔️", bg: "#2a2a2a" };
  if (c.costume) return { icon: "🎽", bg: "#102a3a" };
  return null;
}

export function avatarSVG(c: Character): string {
  const { color } = c;
  const light = shade(color, 70);
  const dark = shade(color, -60);
  const badge = traitBadge(c);

  return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-${c.id}" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stop-color="${light}" />
          <stop offset="60%" stop-color="${color}" />
          <stop offset="100%" stop-color="${dark}" />
        </radialGradient>
        <radialGradient id="shine-${c.id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <circle cx="32" cy="32" r="32" fill="url(#bg-${c.id})" />
      <circle cx="32" cy="32" r="27" fill="none" stroke="${light}" stroke-opacity="0.35" stroke-width="1.5" />
      <ellipse cx="22" cy="18" rx="16" ry="10" fill="url(#shine-${c.id})" />

      <text x="32" y="42" font-size="30" text-anchor="middle" dominant-baseline="middle">${c.emoji}</text>

      ${
        badge
          ? `<circle cx="50" cy="50" r="11" fill="${badge.bg}" stroke="${dark}" stroke-width="1.5" />
             <text x="50" y="54" font-size="12" text-anchor="middle" dominant-baseline="middle">${badge.icon}</text>`
          : ""
      }
    </svg>
  `;
}
