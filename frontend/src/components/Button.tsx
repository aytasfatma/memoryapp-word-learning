import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'ghost';
}

export function Button({ children, variant = 'primary', className, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
}
