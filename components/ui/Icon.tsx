import { icons, type IconName } from '@/lib/icons';
import { cn } from '@/lib/cn';

type Props = {
  name: IconName | (string & {});
  size?: 16 | 20 | 24 | 32 | 40 | 48;
  filled?: boolean;
  className?: string;
  /** Give a label only when the icon carries meaning on its own. */
  label?: string;
};

/** Material Symbols Rounded, weight 400, inline SVG (DESIGN §9). */
export function Icon({ name, size = 24, filled, className, label }: Props) {
  const key = (filled ? `${name}_fill` : name) as IconName;
  const d = icons[key] ?? icons[name as IconName];
  if (!d) return null;
  return (
    <svg
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill="currentColor"
      className={cn('shrink-0', className)}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
