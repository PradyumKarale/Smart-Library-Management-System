import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  options,
  placeholder,
  id,
  className = '',
  ...rest
}) => {
  const inputId = id ?? `select-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`
          w-full bg-slate-900/60 border rounded-lg px-3 py-2 text-sm text-white
          focus:outline-none focus:ring-2 transition-all duration-150 appearance-none
          ${error
            ? 'border-rose-500/60 focus:ring-rose-500/30'
            : 'border-slate-700/60 focus:ring-brand-500/30 focus:border-brand-500/60'}
          ${className}
        `}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-slate-800">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
};
