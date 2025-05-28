import { html } from "hono/html";

interface CardProps {
  children: any;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export const Card = ({ children, className = "", hover = true, padding = "md" }: CardProps) => {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  };

  if (hover) {
    return html`
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 ${paddingClasses[padding]} ${className} transition-all duration-200 ease-out hover:transform hover:scale-[1.02] hover:shadow-lg">
        ${children}
      </div>
    `;
  }

  return html`
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 ${paddingClasses[padding]} ${className}">
      ${children}
    </div>
  `;
};
