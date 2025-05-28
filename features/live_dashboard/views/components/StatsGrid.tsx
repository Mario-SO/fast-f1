import { html } from "hono/html";
import { StatCard } from "../../../../core/ui/StatCard.tsx";
import { DashboardStats } from "../../services/live_dashboard.service.ts";

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return html`
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Current Leader Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-2 mb-1">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <p class="text-sm font-medium text-gray-600">Current Leader</p>
            </div>
            <p class="text-2xl font-bold text-gray-900 font-mono">${stats.currentLeader.driver}</p>
            <p class="text-xs text-gray-500">${stats.currentLeader.team}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Fastest Lap Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-2 mb-1">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm font-medium text-gray-600">Fastest Lap</p>
            </div>
            <p class="text-2xl font-bold text-gray-900 font-mono">${stats.fastestLap.time}</p>
            <p class="text-xs text-gray-500">${stats.fastestLap.driver}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Lap Progress Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-2 mb-1">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p class="text-sm font-medium text-gray-600">Lap Progress</p>
            </div>
            <p class="text-2xl font-bold text-gray-900 font-mono">${stats.lapProgress.current}/${stats.lapProgress.total}</p>
            <p class="text-xs text-gray-500">${stats.lapProgress.percentage}% Complete</p>
          </div>
          <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;
}; 