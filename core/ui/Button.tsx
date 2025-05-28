import { html } from "hono/html";

interface ButtonProps {
  children: any;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: string;
  disabled?: boolean;
  icon?: any;
}

export const Button = ({ 
  children, 
  variant = "secondary", 
  size = "md", 
  className = "",
  onClick = "",
  disabled = false,
  icon
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-out";
  
  const variantClasses = {
    primary: "bg-f1-red text-white hover:bg-red-700 focus:ring-2 focus:ring-f1-red focus:ring-offset-2 active:transform active:scale-95",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:transform active:scale-95",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:transform active:scale-95"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return html`
    <button 
      class="${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}"
      ${disabled ? 'disabled' : ''}
      ${onClick ? `onclick="${onClick}"` : ''}
    >
      ${icon ? html`<span class="mr-2">${icon}</span>` : ''}
      ${children}
    </button>
  `;
};
