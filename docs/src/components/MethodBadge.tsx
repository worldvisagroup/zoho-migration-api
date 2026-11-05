import React from 'react';

interface MethodBadgeProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
  const colors = {
    GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    POST: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    PATCH: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded font-mono text-xs font-semibold border ${colors[method] || colors.GET}`}
    >
      {method}
    </span>
  );
};

