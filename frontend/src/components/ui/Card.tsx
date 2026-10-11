import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  aspect16x9?: boolean;
  glass?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  aspect16x9 = false,
  glass = false,
  hoverable = true,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-3xl border transition-all duration-300';
  const glassClasses = glass
    ? 'bg-white/85 backdrop-blur-md border-white/60 shadow-lg'
    : 'bg-white border-slate-200/90 shadow-xs';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-slate-300' : '';
  const aspectClass = aspect16x9 ? 'aspect-[16/9]' : '';

  return (
    <div
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${aspectClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-6 pb-4 border-b border-slate-100 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-6 pt-4 border-t border-slate-100 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
