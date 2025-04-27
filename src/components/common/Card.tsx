import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
  noPadding = false,
}) => {
  const hasHeader = title || subtitle;
  
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {hasHeader && (
        <div className={`px-6 py-4 border-b border-neutral-200 ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium text-neutral-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={`${noPadding ? '' : 'p-6'} ${contentClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-6 py-4 bg-neutral-50 border-t border-neutral-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;