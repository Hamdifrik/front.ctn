import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm',
    accent: 'bg-accent-500 hover:bg-accent-600 text-primary-800 shadow-sm',
    outline: 'bg-white border border-primary-300 text-primary-700 hover:bg-primary-50',
    ghost: 'bg-transparent hover:bg-primary-50 text-primary-700',
    danger: 'bg-error-500 hover:bg-error-600 text-white shadow-sm',
  }[variant];
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }[size];
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledStyles = disabled || loading
    ? 'opacity-60 cursor-not-allowed pointer-events-none'
    : '';
  
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-md
        transition-colors duration-200 relative
        ${variantStyles}
        ${sizeStyles}
        ${widthStyles}
        ${disabledStyles}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-spin h-4 w-4 border-2 border-current border-r-transparent rounded-full" />
        </span>
      )}
      
      <span className={`flex items-center ${loading ? 'opacity-0' : ''}`}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </span>
    </button>
  );
};

export default Button;