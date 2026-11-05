import React from 'react';
import { Info, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

interface CalloutProps {
  type: 'note' | 'tip' | 'warning' | 'important';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ type, title, children }) => {
  const configs = {
    note: {
      icon: Info,
      bg: 'bg-blue-950/40',
      border: 'border-blue-500/30',
      titleColor: 'text-blue-400',
      iconColor: 'text-blue-400',
      defaultTitle: 'Note',
    },
    tip: {
      icon: Lightbulb,
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/30',
      titleColor: 'text-emerald-400',
      iconColor: 'text-emerald-400',
      defaultTitle: 'Tip',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/30',
      titleColor: 'text-amber-400',
      iconColor: 'text-amber-400',
      defaultTitle: 'Warning',
    },
    important: {
      icon: AlertCircle,
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/30',
      titleColor: 'text-rose-400',
      iconColor: 'text-rose-400',
      defaultTitle: 'Important',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`my-4 rounded-lg border ${config.border} ${config.bg} p-4 text-sm text-slate-300 transition-all`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
        <span className={`font-semibold tracking-wide uppercase text-xs ${config.titleColor}`}>
          {title || config.defaultTitle}
        </span>
      </div>
      <div className="pl-6 space-y-1 leading-relaxed">{children}</div>
    </div>
  );
};

