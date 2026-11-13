// Generates the JCCF FUTA Material 3 colour roles from one brand seed colour.
// Usage: node generate-theme.mjs "#C8102E"   (replace with the red sampled from the official logo)
// Output: prints CSS custom properties for light and dark schemes, ready to paste into jccf-theme.css.
import {
  argbFromHex, hexFromArgb, Hct, SchemeFidelity, MaterialDynamicColors, TonalPalette,
} from '@material/material-color-utilities';

const seedHex = process.argv[2] || '#C8102E';
const YELLOW = '#FADD26'; // "yellow glow" sampled from the official logo (olive branch, stars)

const roles = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
  'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer',
  'surfaceContainerHigh', 'surfaceContainerHighest', 'surfaceDim', 'surfaceBright',
  'inverseSurface', 'inverseOnSurface', 'inversePrimary',
  'outline', 'outlineVariant', 'scrim', 'shadow',
];
function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
const kebab =(s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function scheme(isDark) {
  const s = new SchemeFidelity(Hct.fromInt(argbFromHex(seedHex)), isDark, 0);
  // Tertiary = the logo's yellow glow, kept as a separate accent
  const yellow = TonalPalette.fromInt(argbFromHex(YELLOW));
  const out = {};
  for (const r of roles) out[r] = hexFromArgb(MaterialDynamicColors[r].getArgb(s));
  // "Red and white": neutrals are near-grey (chroma 3) instead of Fidelity's pink tint
  const hue = Hct.fromInt(argbFromHex(seedHex)).hue;
  const n = TonalPalette.fromHueAndChroma(hue, 3);
  const nv = TonalPalette.fromHueAndChroma(hue, 6);
  const N = (t) => hexFromArgb(n.tone(t));
  Object.assign(out, isDark ? {
    surface: N(6), onSurface: N(90), surfaceVariant: hexFromArgb(nv.tone(30)), onSurfaceVariant: hexFromArgb(nv.tone(80)),
    surfaceContainerLowest: N(4), surfaceContainerLow: N(10), surfaceContainer: N(12),
    surfaceContainerHigh: N(17), surfaceContainerHighest: N(22), surfaceDim: N(6), surfaceBright: N(24),
    inverseSurface: N(90), inverseOnSurface: N(20), outline: hexFromArgb(nv.tone(60)), outlineVariant: hexFromArgb(nv.tone(30)),
  } : {
    surface: N(99), onSurface: N(10), surfaceVariant: hexFromArgb(nv.tone(90)), onSurfaceVariant: hexFromArgb(nv.tone(30)),
    surfaceContainerLowest: '#ffffff', surfaceContainerLow: N(97), surfaceContainer: N(95),
    surfaceContainerHigh: N(93), surfaceContainerHighest: N(90), surfaceDim: N(87), surfaceBright: N(99),
    inverseSurface: N(20), inverseOnSurface: N(95), outline: hexFromArgb(nv.tone(50)), outlineVariant: hexFromArgb(nv.tone(80)),
  });
  // Keep the exact brand red as light primary when white text on it passes AA (4.5:1)
  if (!isDark && contrast(seedHex, '#ffffff') >= 4.5) out.primary = seedHex.toLowerCase();
  // Light containers stay light (tone 90) so tinted chips and cards read as soft red, not solid red
  if (!isDark) {
    const pp = TonalPalette.fromInt(argbFromHex(seedHex));
    out.primaryContainer = hexFromArgb(pp.tone(90));
    out.onPrimaryContainer = hexFromArgb(pp.tone(10));
  }
  out.tertiary = hexFromArgb(yellow.tone(isDark ? 80 : 70));
  out.onTertiary = hexFromArgb(yellow.tone(isDark ? 20 : 10));
  out.tertiaryContainer = hexFromArgb(yellow.tone(isDark ? 30 : 90));
  out.onTertiaryContainer = hexFromArgb(yellow.tone(isDark ? 90 : 10));
  return out;
}

const print = (name, obj) => {
  console.log(`/* ${name} */`);
  for (const [k, v] of Object.entries(obj)) console.log(`  --md-sys-color-${kebab(k)}: ${v};`);
};
const light = scheme(false), dark = scheme(true);
print('light', light); print('dark', dark);

// Tonal palette of the seed, for reference
const p = TonalPalette.fromInt(argbFromHex(seedHex));
console.log('/* primary tonal palette */');
for (const t of [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100]) console.log(`  --md-ref-palette-primary${t}: ${hexFromArgb(p.tone(t))};`);

console.log('/* contrast checks (AA needs 4.5 for text, 3 for large text/UI) */');
for (const [nm, s] of [['light', light], ['dark', dark]]) {
  for (const [fg, bg] of [['onPrimary', 'primary'], ['onSurface', 'surface'], ['onSurfaceVariant', 'surface'], ['primary', 'surface'], ['onTertiary', 'tertiary'], ['onPrimaryContainer', 'primaryContainer']]) {
    console.log(`  ${nm} ${fg}/${bg}: ${contrast(s[fg], s[bg]).toFixed(2)}`);
  }
}
if (process.argv.includes('--json')) console.log(JSON.stringify({ seedHex, light, dark }, null, 2));
