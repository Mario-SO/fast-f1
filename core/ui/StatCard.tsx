import { html } from "hono/html";
import { Card } from "./Card.tsx";

type IconColor = "blue" | "purple" | "green" | "red" | "yellow";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  iconColor?: IconColor;
  valueColor?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconColor = "blue",
  valueColor = "gray-900"
}: StatCardProps) => {
  const iconColorClasses: Record<IconColor, string> = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600", 
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600"
  };

  return Card({
    children: html`
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${icon}
            </svg>
            <p class="text-sm font-medium text-gray-600">${title}</p>
          </div>
          <p class="text-2xl font-bold text-${valueColor} font-mono">${value}</p>
          ${subtitle ? html`<p class="text-xs text-gray-500">${subtitle}</p>` : ''}
        </div>
        <div class="w-12 h-12 ${iconColorClasses[iconColor]} rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${icon}
          </svg>
        </div>
      </div>
    `,
    hover: true
  });
}; 