import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an OKLCH color value to HEX format
 * @param oklchStr - The OKLCH color string (e.g., "oklch(75% 0.15 120)")
 * @returns The HEX color string (e.g., "#8fd3a7") or null if input is invalid
 */
export function oklchToHex(oklchStr: string): string | undefined {
  // Extract OKLCH components
  const match = oklchStr.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/i);
  if (!match) return undefined;

  const L = parseFloat(match[1]) / (match[1].includes('%') ? 100 : 1); // Normalize to 0-1
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // 1. Convert OKLCH to OKLab
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  // 2. Convert OKLab to XYZ
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const X = 1.2270138511 * l - 0.5577999807 * m + 0.281256149 * s;
  const Y = -0.0405801784 * l + 1.1122568696 * m - 0.0716766787 * s;
  const Z = -0.0763812845 * l - 0.4214819784 * m + 1.5861632204 * s;

  // 3. Convert XYZ to linear RGB
  let r = 3.2409699419 * X - 1.5373831776 * Y - 0.4986107603 * Z;
  let g = -0.9692436363 * X + 1.8759675015 * Y + 0.0415550574 * Z;
  let b_ = 0.0556300797 * X - 0.2039769589 * Y + 1.0569715142 * Z;

  // 4. Apply gamma correction and clamp to [0, 1]
  const toSRGB = (v: number): number => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };

  const R = Math.round(toSRGB(r) * 255);
  const G = Math.round(toSRGB(g) * 255);
  const B = Math.round(toSRGB(b_) * 255);

  // Convert to HEX
  const toHex = (n: number): string => n.toString(16).padStart(2, '0');
  return `#${toHex(R)}${toHex(G)}${toHex(B)}`.toLowerCase();
}
