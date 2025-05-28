import { html } from "hono/html";
import { Driver } from "../../services/live_dashboard.service.ts";

interface DriverRowProps {
  driver: Driver;
  index?: number;
}

export const DriverRow = ({ driver, index = 0 }: DriverRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "green": return "bg-green-400";
      case "yellow": return "bg-yellow-400";
      case "red": return "bg-red-400";
      default: return "bg-gray-400";
    }
  };

  const getGapColor = (gap: string) => {
    if (gap === "Leader") return "text-blue-600 font-semibold";
    if (gap.includes("LAP")) return "text-red-600";
    return "text-gray-900";
  };

  const getDRSColor = (drs?: string) => {
    switch (drs) {
      case "ON": return "text-green-600 font-bold";
      case "ELIGIBLE": return "text-yellow-600";
      case "OFF": return "text-gray-400";
      default: return "text-gray-300";
    }
  };

  // Prepare driver data for the details panel
  const driverData = {
    number: driver.driverNumber,
    acronym: driver.driver,
    name: driver.fullName || driver.broadcastName || driver.driver,
    team: driver.team,
    teamColor: driver.teamColor?.replace('#', ''),
    position: driver.pos,
    gap: driver.gap,
    lastLap: driver.lastLap,
    bestLap: driver.lastLap, // For now, using last lap as best lap
    speed: driver.speed,
    s1: '-', // Sector times would need to be fetched separately
    s2: '-',
    s3: '-',
    headshotUrl: driver.headshotUrl
  };

  return html`
    <div 
      class="flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer rounded-lg driver-row"
      data-driver='${JSON.stringify(driverData)}'
      title="Click to view driver details"
    >
      <!-- Position -->
      <span class="w-4 text-xs font-bold text-gray-700">${driver.pos}</span>
      
      <!-- Team Color Bar -->
      <div class="w-0.5 h-4 rounded-full" style="background-color: ${driver.teamColor || '#6B7280'}"></div>
      
      <!-- Driver Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-1">
          <span class="text-xs font-bold text-gray-900">${driver.driver}</span>
          <span class="text-xs text-gray-500 truncate">${driver.team}</span>
        </div>
        
        <!-- Live Data Row -->
        <div class="flex items-center space-x-3 mt-1">
          ${driver.speed ? html`
            <div class="flex items-center space-x-1">
              <svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-xs font-mono text-blue-600">${driver.speed} km/h</span>
            </div>
          ` : ''}
          
          ${driver.gear ? html`
            <div class="flex items-center space-x-1">
              <span class="text-xs text-gray-500">G</span>
              <span class="text-xs font-mono font-bold text-gray-700">${driver.gear}</span>
            </div>
          ` : ''}
          
          ${driver.drs ? html`
            <div class="flex items-center space-x-1">
              <span class="text-xs font-mono ${getDRSColor(driver.drs)}">DRS</span>
            </div>
          ` : ''}
          
          ${driver.throttle !== undefined ? html`
            <div class="flex items-center space-x-1">
              <div class="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-green-500 transition-all duration-300" style="width: ${driver.throttle}%"></div>
              </div>
              <span class="text-xs text-gray-500">${driver.throttle}%</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Gap and Lap Time -->
      <div class="text-right">
        <div class="text-xs font-mono ${getGapColor(driver.gap)}">${driver.gap}</div>
        <div class="text-xs text-gray-500 font-mono">${driver.lastLap}</div>
      </div>
      
      <!-- Status Indicator -->
      <div class="w-2 h-2 rounded-full ${getStatusColor(driver.status)}"></div>
    </div>
  `;
}; 