import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  active?: boolean;
  activeColor?: string;
  color?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  active = false,
  activeColor,
  color,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`p-1 rounded-md cursor-pointer text-white disabled:bg-gray-400 disabled:cursor-not-allowed ${
        active ? activeColor ?? "bg-green-400" : color ?? "bg-blue-400"
      } ${active ? "" : `hover:opacity-80`} transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
