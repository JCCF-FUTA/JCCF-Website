'use client';

import { useId, type ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

/**
 * M3 outlined text fields (DESIGN §C19): 56px, label floats onto the border on focus/filled,
 * helper and error text below, linked with aria-describedby.
 */

type FieldBase = {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  className?: string;
};

const box = (error?: string) =>
  cn(
    'peer block w-full rounded-md border bg-transparent px-4 text-body-lg text-on-surface outline-none transition-colors',
    'placeholder:text-transparent focus:border-2 focus:px-[15px]',
    error ? 'border-error focus:border-error' : 'border-outline hover:border-on-surface focus:border-primary',
  );

const floatingLabel = (error?: string) =>
  cn(
    'pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-[var(--field-bg,var(--md-sys-color-surface))] px-1 text-body-sm transition-all duration-150 ease-standard',
    'peer-placeholder-shown:top-7 peer-placeholder-shown:text-body-lg peer-focus:top-0 peer-focus:text-body-sm',
    error ? 'text-error' : 'text-on-surface-variant peer-focus:text-primary',
  );

function Support({ id, helper, error, counter }: { id: string; helper?: string; error?: string; counter?: string }) {
  if (!helper && !error && !counter) return null;
  return (
    <div className="mt-1 flex gap-4 px-4 text-body-sm">
      <p id={id} className={cn('flex-1', error ? 'text-error' : 'text-on-surface-variant')}>
        {error ? (
          <span className="inline-flex items-center gap-1"><Icon name="error" size={16} /> {error}</span>
        ) : helper}
      </p>
      {counter && <span className="text-on-surface-variant tabular-nums">{counter}</span>}
    </div>
  );
}

const labelText = (label: string, required?: boolean) => (required ? `${label} (required)` : label);

export function TextField({ label, required, helper, error, className, ...rest }: FieldBase & Omit<ComponentProps<'input'>, 'className'>) {
  const id = useId();
  const sid = `${id}-support`;
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          placeholder=" "
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={helper || error ? sid : undefined}
          className={cn(box(error), 'h-14')}
          {...rest}
        />
        <label htmlFor={id} className={floatingLabel(error)}>{labelText(label, required)}</label>
      </div>
      <Support id={sid} helper={helper} error={error} />
    </div>
  );
}

export function TextArea({ label, required, helper, error, className, maxLength, value, ...rest }: FieldBase & Omit<ComponentProps<'textarea'>, 'className'>) {
  const id = useId();
  const sid = `${id}-support`;
  const count = typeof value === 'string' && maxLength ? `${value.length}/${maxLength}` : undefined;
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          id={id}
          placeholder=" "
          required={required}
          maxLength={maxLength}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={sid}
          className={cn(box(error), 'min-h-36 resize-y py-4')}
          {...rest}
        />
        <label htmlFor={id} className={cn(floatingLabel(error), 'peer-placeholder-shown:top-7')}>{labelText(label, required)}</label>
      </div>
      <Support id={sid} helper={helper} error={error} counter={count} />
    </div>
  );
}

export function SelectField({
  label, required, helper, error, className, children, ...rest
}: FieldBase & Omit<ComponentProps<'select'>, 'className'>) {
  const id = useId();
  const sid = `${id}-support`;
  return (
    <div className={className}>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={helper || error ? sid : undefined}
          className={cn(box(error), 'h-14 appearance-none pr-12')}
          {...rest}
        >
          {children}
        </select>
        <label htmlFor={id} className={cn(floatingLabel(error), 'top-0 text-body-sm')}>{labelText(label, required)}</label>
        <Icon name="keyboard_arrow_down" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
      </div>
      <Support id={sid} helper={helper} error={error} />
    </div>
  );
}

export function Checkbox({ label, description, className, ...rest }: { label: string; description?: string; className?: string } & Omit<ComponentProps<'input'>, 'type' | 'className'>) {
  const id = useId();
  return (
    <div className={cn('flex gap-3', className)}>
      <span className="relative -m-3 inline-flex size-12 shrink-0 items-center justify-center">
        <input id={id} type="checkbox" className="peer size-5 cursor-pointer appearance-none rounded-xs border-2 border-on-surface-variant checked:border-primary checked:bg-primary" {...rest} />
        <Icon name="check" size={16} className="pointer-events-none absolute text-on-primary opacity-0 peer-checked:opacity-100" />
      </span>
      <label htmlFor={id} className="cursor-pointer pt-0.5">
        <span className="text-body-lg">{label}</span>
        {description && <span className="block text-body-md text-on-surface-variant">{description}</span>}
      </label>
    </div>
  );
}

export function FormAlert({ kind = 'error', children }: { kind?: 'error' | 'info'; children: React.ReactNode }) {
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={cn('flex items-start gap-2 rounded-md p-4 text-body-lg', kind === 'error' ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant')}>
      <Icon name={kind === 'error' ? 'error' : 'info'} size={20} className="mt-px" />
      <span>{children}</span>
    </p>
  );
}

export function PrivacyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-body-md text-on-surface-variant">
      <Icon name="lock" size={16} className="mt-px" />
      <span>{children}</span>
    </p>
  );
}
