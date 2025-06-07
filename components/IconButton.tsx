
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClass?: string; // Made optional
  tooltip?: string;
  children?: React.ReactNode; // Explicitly define children prop
}

export const IconButton: React.FC<IconButtonProps> = ({ iconClass, tooltip, className, children, ...props }) => {
  return (
    <button
      {...props}
      className={`relative group focus:outline-none ${className}`}
    >
      {iconClass && <i className={iconClass}></i>} {/* Render <i> if iconClass is provided */}
      {children} {/* Render any children passed to IconButton */}
      {tooltip && (
        <span className="absolute bottom-full mb-2 right-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {tooltip}
        </span>
      )}
    </button>
  );
};
