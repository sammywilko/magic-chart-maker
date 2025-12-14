import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-black text-lg transition-all duration-150 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-[#8B5CF6] text-white border-b-4 border-[#7C3AED] hover:-translate-y-1 hover:border-b-[6px] active:border-b-0 active:translate-y-1 shadow-lg shadow-purple-200",
    secondary: "bg-white text-[#8B5CF6] border-2 border-[#E9D5FF] border-b-4 hover:-translate-y-1 active:border-b-2 active:translate-y-0",
    outline: "bg-transparent border-2 border-purple-300 text-purple-600 hover:border-purple-500 hover:text-purple-800",
    ghost: "bg-transparent text-gray-500 hover:text-purple-600 hover:bg-purple-50",
    danger: "bg-red-500 text-white border-b-4 border-red-700 hover:-translate-y-1 active:border-b-0 active:translate-y-1"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Weaving Magic...
        </>
      ) : children}
    </button>
  );
};