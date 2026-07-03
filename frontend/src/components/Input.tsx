import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, ...rest }: InputProps) {
  return (
    <div className="input-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} className={error ? 'input-error' : ''} {...rest} />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}
