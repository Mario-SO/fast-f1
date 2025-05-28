import { html } from "hono/html";
import { Card } from "../../../../core/ui/Card.tsx";
import { Button } from "../../../../core/ui/Button.tsx";
import { SessionInfo } from "../../services/live_dashboard.service.ts";

interface SidePanelProps {
  sessionInfo: SessionInfo;
}

export const SidePanel = ({ sessionInfo }: SidePanelProps) => {
  return html`
    <div class="space-y-4">
      
      <!-- Compact Session Info -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex items-center space-x-2 mb-3">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-base font-semibold text-gray-900">Session Info</h3>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="flex flex-col">
            <span class="text-gray-500">Event</span>
            <span class="font-medium text-gray-900 truncate">${sessionInfo.event}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500">Session</span>
            <span class="font-medium text-gray-900">${sessionInfo.session}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500">Weather</span>
            <span class="font-medium text-gray-900">${sessionInfo.weather}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500">Track</span>
            <span class="font-medium text-gray-900 font-mono">${sessionInfo.trackTemp}</span>
          </div>
        </div>
      </div>

      <!-- Driver Details Card -->
      <div id="driver-details" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hidden">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <h3 class="text-base font-semibold text-gray-900">Driver Details</h3>
          </div>
          <button onclick="closeDriverDetails()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Driver Header -->
        <div class="flex items-center space-x-3 mb-4 p-3 rounded-lg" id="driver-header" style="background-color: #f3f4f6;">
          <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200" id="driver-avatar">
            <img id="driver-headshot" src="" alt="" class="w-full h-full object-cover hidden">
            <div id="driver-initials" class="w-full h-full flex items-center justify-center text-white font-bold text-sm"></div>
          </div>
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <span id="driver-number" class="text-xs font-bold px-2 py-1 rounded text-white"></span>
              <span id="driver-acronym" class="text-sm font-bold text-gray-900"></span>
            </div>
            <h4 id="driver-name" class="text-lg font-bold text-gray-900"></h4>
            <p id="driver-team" class="text-sm text-gray-600"></p>
          </div>
        </div>

        <!-- Driver Stats -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs text-gray-500 mb-1">Position</div>
            <div id="driver-position" class="text-xl font-bold text-gray-900">-</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs text-gray-500 mb-1">Gap</div>
            <div id="driver-gap" class="text-xl font-bold text-gray-900">-</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs text-gray-500 mb-1">Last Lap</div>
            <div id="driver-last-lap" class="text-lg font-bold text-gray-900">-</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs text-gray-500 mb-1">Best Lap</div>
            <div id="driver-best-lap" class="text-lg font-bold text-gray-900">-</div>
          </div>
        </div>

        <!-- Driver Performance -->
        <div class="space-y-2">
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">Speed</span>
            <span id="driver-speed" class="font-medium">- km/h</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">Sector 1</span>
            <span id="driver-s1" class="font-medium font-mono">-</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">Sector 2</span>
            <span id="driver-s2" class="font-medium font-mono">-</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">Sector 3</span>
            <span id="driver-s3" class="font-medium font-mono">-</span>
          </div>
        </div>
      </div>
    </div>
  `;
};