import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

// Shared building blocks for the data-dense portal, admin and inventory screens.

export const PageHeader: React.FC<{
  title: string;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}> = ({ title, description, eyebrow, actions, className = '' }) => (
  <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
    <div className="min-w-0">
      {eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{eyebrow}</p>}
      <h1 className="mt-0.5 text-[22px] font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-[14px] text-slate-600">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneText: Record<Tone, string> = {
  neutral: 'text-slate-500',
  success: 'text-emerald-700',
  warning: 'text-amber-700',
  danger: 'text-rose-700',
  info: 'text-navy',
};
const toneIcon: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  info: 'bg-navy-soft text-navy',
};

export interface StatTileProps {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  to?: string;
  onClick?: () => void;
}

// Compact KPI. Values must come from real data; `note` explains the figure in words.
export const StatTile: React.FC<StatTileProps> = ({ label, value, note, tone = 'neutral', icon, to, onClick }) => {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-slate-600">{label}</p>
        {icon && (
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg [&>svg]:h-4 [&>svg]:w-4', toneIcon[tone])} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-1 text-[26px] font-semibold leading-tight tracking-tight tabular text-slate-900">{value}</p>
      {note && <p className={cn('mt-1 text-[12px] font-medium', toneText[tone])}>{note}</p>}
    </>
  );
  const cls = 'block rounded-xl border border-admin-line bg-white p-4 text-left';
  const interactive = 'transition-colors hover:border-navy/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy';
  if (to) return <Link to={to} className={cn(cls, interactive)}>{body}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={cn(cls, interactive, 'w-full')}>{body}</button>;
  return <div className={cls}>{body}</div>;
};

export const Panel: React.FC<{
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
}> = ({ title, description, actions, children, className = '', bodyClassName = '', id }) => (
  <section id={id} className={cn('overflow-hidden rounded-xl border border-admin-line bg-white', className)}>
    {(title || actions) && (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-line px-4 py-3 sm:px-5">
        <div className="min-w-0">
          {title && <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>}
          {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className={bodyClassName}>{children}</div>
  </section>
);

// Table styles shared across operational screens
export const table = {
  wrap: 'overflow-x-auto',
  table: 'w-full text-left text-[13px]',
  thead: 'bg-slate-50 text-[12px] font-semibold text-slate-600',
  th: 'whitespace-nowrap px-4 py-2.5 font-semibold',
  tbody: 'divide-y divide-admin-line',
  tr: 'hover:bg-slate-50/70',
  td: 'px-4 py-3 align-middle text-slate-700',
  num: 'px-4 py-3 text-right tabular text-slate-900',
};

export const MonoTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-slate-700">{children}</span>
);

export const DemoNotice: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={cn('rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-900', className)}>
    {children}
  </p>
);
