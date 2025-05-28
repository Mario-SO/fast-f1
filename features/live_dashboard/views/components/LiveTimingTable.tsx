import { html } from "hono/html";

export const LiveTimingTable = ({ isLive = true, intervalsPolling = "load, every 2s, refresh" }: { isLive?: boolean; intervalsPolling?: string } = {}) => {
  return html`
    <div class="lg:col-span-2">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div class="overflow-hidden">
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 class="text-lg font-semibold text-gray-900">${isLive ? 'Live Timing' : 'Session Timing'}</h2>
              ${!isLive ? html`
                <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Historical</span>
              ` : ''}
            </div>
          </div>
          
          <!-- Compact Table Header -->
          <div class="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                <span class="w-4">#</span>
                <span class="flex-1">Driver</span>
                <span class="w-12 text-right">Gap</span>
              </div>
              <div class="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                <span class="w-4">#</span>
                <span class="flex-1">Driver</span>
                <span class="w-12 text-right">Gap</span>
              </div>
            </div>
          </div>

          <!-- Live Data Container -->
          <div 
            id="live-intervals-data" 
            class="p-3"
            hx-get="/live/api/intervals" 
            hx-trigger="${intervalsPolling}"
          >
            <!-- Loading message -->
            <div class="text-center py-6 text-gray-500">
              ${isLive ? 'Loading driver data...' : 'Loading session data...'}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal (Hidden by default) -->
    <div id="settings-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50" onclick="closeSettings()">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Dashboard Settings</h3>
            <button onclick="closeSettings()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Refresh Interval</label>
              <select id="refresh-interval" class="w-full border border-gray-300 rounded-md px-3 py-2" ${!isLive ? 'disabled' : ''}>
                <option value="1">1 second</option>
                <option value="2" selected>2 seconds</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
              </select>
              ${!isLive ? html`
                <p class="text-xs text-gray-500 mt-1">Polling disabled for non-live sessions</p>
              ` : ''}
            </div>
            
            <div>
              <label class="flex items-center">
                <input type="checkbox" id="auto-scroll" class="mr-2" checked>
                <span class="text-sm text-gray-700">Auto-scroll to leader</span>
              </label>
            </div>
            
            <div>
              <label class="flex items-center">
                <input type="checkbox" id="sound-alerts" class="mr-2" ${!isLive ? 'disabled' : ''}>
                <span class="text-sm text-gray-700">Sound alerts for position changes</span>
              </label>
              ${!isLive ? html`
                <p class="text-xs text-gray-500 mt-1">Alerts disabled for non-live sessions</p>
              ` : ''}
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button onclick="closeSettings()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button onclick="saveSettings()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
          </div>
        </div>
      </div>
    </div>
  `;
}; 