import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = ({ children, className }) => {
  return (
    <div className={cn('card', className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ title, subtitle, action, className }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100 flex items-center justify-between', className)}>
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 bg-slate-50/50 border-t border-slate-100', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };
