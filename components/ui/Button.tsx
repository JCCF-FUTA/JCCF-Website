import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export type ButtonVariant = 'filled' | 'filled-inverse' | 'tonal' | 'outlined' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type Tone = 'light' | 'stage';

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: Tone;
  icon?: string;
  trailingIcon?: string;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

const variants: Record<Tone, Record<ButtonVariant, string>> = {
  light: {
    filled: 'bg-primary text-on-primary',
    'filled-inverse': 'bg-on-surface text-surface',
    tonal: 'bg-primary-container text-on-primary-container',
    outlined: 'border border-outline text-primary',
    text: 'text-primary',
  },
  stage: {
    filled: 'bg-primary text-white',
    'filled-inverse': 'bg-white text-stage',
    tonal: 'bg-white/10 text-on-stage',
    outlined: 'border border-stage-outline text-on-stage',
    text: 'text-stage-accent-text',
  },
};

const sizes: Record<ButtonSize, string> = {
  // sm keeps a 48px hit area via the ::before pseudo element
  sm: 'h-10 px-5 before:absolute before:-inset-y-1 before:inset-x-0 before:content-[""]',
  md: 'h-12 px-6',
  lg: 'h-14 px-8',
};

export function buttonClasses({ variant = 'filled', size = 'md', tone = 'light', className }: Pick<Common, 'variant' | 'size' | 'tone' | 'className'>) {
  return cn(
    'state-layer group/btn relative inline-flex items-center justify-center gap-2 rounded-full text-label-lg font-semibold whitespace-nowrap select-none',
    'transition-transform duration-150 ease-standard active:scale-[0.98]',
    'aria-disabled:pointer-events-none aria-disabled:opacity-40 disabled:opacity-40 disabled:active:scale-100',
    variant === 'text' ? 'h-12 px-3 -mx-3' : sizes[size],
    variants[tone][variant],
    className,
  );
}

function Content({ icon, trailingIcon, loading, children }: Pick<Common, 'icon' | 'trailingIcon' | 'loading' | 'children'>) {
  return (
    <>
      {loading ? (
        <svg viewBox="0 0 24 24" width={20} height={20} className="animate-[spin_0.9s_linear_infinite]" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="42 60" strokeLinecap="round" />
        </svg>
      ) : icon ? (
        <Icon name={icon} size={20} />
      ) : null}
      <span>{children}</span>
      {trailingIcon && (
        <Icon name={trailingIcon} size={20} className="transition-transform duration-300 ease-standard group-hover/btn:translate-x-1" />
      )}
    </>
  );
}

type LinkButtonProps = Common & { href: string; external?: boolean } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>;

/** A link that looks like a button (navigation). External links open in a new tab. */
export function LinkButton({ href, external, variant, size, tone, icon, trailingIcon, className, children, ...rest }: LinkButtonProps) {
  const cls = buttonClasses({ variant, size, tone, className });
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
  if (isExternal) {
    const newTab = /^https?:/.test(href);
    return (
      <a href={href} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        <Content icon={icon} trailingIcon={trailingIcon}>{children}</Content>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <Content icon={icon} trailingIcon={trailingIcon}>{children}</Content>
    </Link>
  );
}

type ButtonProps = Common & Omit<ComponentProps<'button'>, 'className' | 'children'>;

export function Button({ variant, size, tone, icon, trailingIcon, loading, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, tone, className })} aria-busy={loading || undefined} {...rest}>
      <Content icon={icon} trailingIcon={trailingIcon} loading={loading}>{children}</Content>
    </button>
  );
}

type IconButtonProps = {
  icon: string;
  label: string;
  variant?: 'outlined' | 'tonal' | 'filled' | 'standard';
  tone?: Tone;
  className?: string;
  href?: string;
} & Omit<ComponentProps<'button'>, 'className' | 'children'>;

const iconVariants: Record<Tone, Record<NonNullable<IconButtonProps['variant']>, string>> = {
  light: {
    outlined: 'border border-outline-variant text-on-surface',
    tonal: 'bg-primary-container text-on-primary-container',
    filled: 'bg-primary text-on-primary',
    standard: 'text-on-surface-variant',
  },
  stage: {
    outlined: 'border border-stage-outline text-on-stage',
    tonal: 'bg-white/10 text-on-stage',
    filled: 'bg-primary text-white',
    standard: 'text-on-stage',
  },
};

/** 48px circular icon button (DESIGN §C04). */
export function IconButton({ icon, label, variant = 'standard', tone = 'light', className, href, type = 'button', ...rest }: IconButtonProps) {
  const cls = cn(
    'state-layer inline-flex size-12 shrink-0 items-center justify-center rounded-full transition-transform duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none',
    iconVariants[tone][variant],
    className,
  );
  if (href) {
    const external = /^https?:/.test(href);
    return external ? (
      <a href={href} className={cls} aria-label={label} title={label} target="_blank" rel="noopener noreferrer"><Icon name={icon} /></a>
    ) : (
      <Link href={href} className={cls} aria-label={label} title={label}><Icon name={icon} /></Link>
    );
  }
  return (
    <button type={type} className={cls} aria-label={label} title={label} {...rest}>
      <Icon name={icon} />
    </button>
  );
}
