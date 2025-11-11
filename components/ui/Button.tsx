
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`
        bg-cyan-600 hover:bg-cyan-700 text-white font-bold
        py-3 px-6 rounded-lg text-lg font-orbitron
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-cyan-500/50
        disabled:bg-gray-600 disabled:cursor-not-allowed
        transform hover:scale-105 active:scale-100
        shadow-lg shadow-cyan-900/50
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
