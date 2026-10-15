import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

// Form field wrapper that wires up label, hint and error text so screen
// readers announce validation messages with the input they belong to.
//
//   <Field label="Phone" error={errors.phone?.message}>
//     {(a11y) => <Input {...a11y} {...register('phone')} />}
//   </Field>

export interface FieldA11yProps {
  id: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
}

export interface FieldProps {
  label: React.ReactNode;
  error?: string;
  hint?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  className?: string;
  labelAction?: React.ReactNode;
  children: (a11y: FieldA11yProps) => React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  error,
  hint,
  required,
  optional,
  className = '',
  labelAction,
  children,
}) => {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-fg">
          {label}
          {required && (
            <span className="text-rose-700" aria-hidden="true">
              {' '}*
            </span>
          )}
          {optional && <span className="font-normal text-fg-muted"> (optional)</span>}
        </label>
        {labelAction}
      </div>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}
      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-[13px] font-medium text-rose-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

const control =
  'w-full rounded-lg border bg-white text-base text-fg transition-colors placeholder:text-fg-muted/70 sm:text-sm ' +
  'focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted ' +
  'read-only:bg-surface-muted read-only:text-fg-muted';

const controlState = (invalid: React.AriaAttributes['aria-invalid']) =>
  invalid === true || invalid === 'true'
    ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-600/15'
    : 'border-surface-line hover:border-fg-muted/40 focus:border-action focus:ring-action/15';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={cn(control, 'h-11 px-3.5', controlState(props['aria-invalid']), className)} {...props} />
  )
);
Input.displayName = 'Input';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(control, 'h-11 cursor-pointer px-3 pr-8', controlState(props['aria-invalid']), className)}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(control, 'min-h-[96px] px-3.5 py-2.5 leading-relaxed', controlState(props['aria-invalid']), className)}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export default Field;
