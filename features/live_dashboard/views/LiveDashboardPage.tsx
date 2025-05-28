import { html } from "hono/html";
import { MainLayout } from "../../../core/layouts/MainLayout.tsx";
import { DashboardHeader } from "./components/DashboardHeader.tsx";
import { LiveTimingTable } from "./components/LiveTimingTable.tsx";
import { StatsGrid } from "./components/StatsGrid.tsx";
import { SidePanel } from "./components/SidePanel.tsx";
import { LiveDashboardService } from "../services/live_dashboard.service.ts";

export const LiveDashboardPage = async () => {
  try {
    // Get live data
    const [stats, sessionInfo] = await Promise.all([
      LiveDashboardService.getDashboardStats(),
      LiveDashboardService.getSessionInfo()
    ]);

    return MainLayout({
      title: "Live F1 Dashboard",
      children: html`
        <div class="min-h-screen bg-gray-50 p-6">
          <div class="max-w-7xl mx-auto">
            
            <!-- Dashboard Header -->
            ${DashboardHeader()}
            
            <!-- Stats Grid -->
            <div 
              id="dashboard-stats" 
              hx-get="/live/api/stats" 
              hx-trigger="load, every 5s"
              hx-swap="innerHTML"
            >
              ${StatsGrid({ stats })}
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <!-- Live Timing Table (Takes up 2 columns) -->
              ${LiveTimingTable()}

              <!-- Side Panel -->
              <div class="space-y-6">
                ${SidePanel({ sessionInfo })}
              </div>
            </div>

          </div>
        </div>
        
        <script>
          // Driver details functionality
          function showDriverDetails(driverData) {
            console.log('showDriverDetails called with:', driverData);
            const card = document.getElementById('driver-details');
            const header = document.getElementById('driver-header');
            
            if (!card) {
              console.error('Driver details card not found');
              return;
            }
            
            // Update driver header styling with team color
            if (driverData.teamColor) {
              header.style.backgroundColor = '#' + driverData.teamColor + '20';
            }
            
            // Update driver avatar
            const headshot = document.getElementById('driver-headshot');
            const initials = document.getElementById('driver-initials');
            if (driverData.headshotUrl) {
              headshot.src = driverData.headshotUrl;
              headshot.classList.remove('hidden');
              initials.style.display = 'none';
            } else {
              headshot.classList.add('hidden');
              initials.textContent = driverData.acronym || driverData.name?.substring(0, 2) || '??';
              initials.style.display = 'flex';
              initials.style.backgroundColor = '#' + (driverData.teamColor || '6B7280');
            }
            
            // Update driver number styling
            const numberEl = document.getElementById('driver-number');
            numberEl.textContent = driverData.number || '?';
            numberEl.style.backgroundColor = '#' + (driverData.teamColor || '6B7280');
            
            // Update driver info
            document.getElementById('driver-acronym').textContent = driverData.acronym || '';
            document.getElementById('driver-name').textContent = driverData.name || 'Unknown Driver';
            document.getElementById('driver-team').textContent = driverData.team || 'Unknown Team';
            
            // Update driver stats
            document.getElementById('driver-position').textContent = driverData.position || '-';
            document.getElementById('driver-gap').textContent = driverData.gap || '-';
            document.getElementById('driver-last-lap').textContent = driverData.lastLap || '-';
            document.getElementById('driver-best-lap').textContent = driverData.bestLap || '-';
            document.getElementById('driver-speed').textContent = driverData.speed ? driverData.speed + ' km/h' : '- km/h';
            document.getElementById('driver-s1').textContent = driverData.s1 || '-';
            document.getElementById('driver-s2').textContent = driverData.s2 || '-';
            document.getElementById('driver-s3').textContent = driverData.s3 || '-';
            
            // Show the card
            card.classList.remove('hidden');
          }
          
          function closeDriverDetails() {
            const card = document.getElementById('driver-details');
            if (card) {
              card.classList.add('hidden');
            }
          }
          
          // Header button functions
          function toggleSettings() {
            document.getElementById('settings-modal').classList.remove('hidden');
          }
          
          function closeSettings() {
            document.getElementById('settings-modal').classList.add('hidden');
          }
          
          function toggleFullscreen() {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
              });
            } else {
              document.exitFullscreen();
            }
          }
          
          function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
              notification.remove();
            }, 3000);
          }
          
          function saveSettings() {
            const interval = document.getElementById('refresh-interval').value;
            const autoScroll = document.getElementById('auto-scroll').checked;
            const soundAlerts = document.getElementById('sound-alerts').checked;
            
            // Update HTMX trigger interval for both stats and intervals
            const statsElement = document.getElementById('dashboard-stats');
            const intervalsElement = document.getElementById('live-intervals-data');
            
            if (statsElement) {
              statsElement.setAttribute('hx-trigger', 'load, every ' + interval + 's');
            }
            if (intervalsElement) {
              intervalsElement.setAttribute('hx-trigger', 'load, every ' + interval + 's, refresh');
            }
            
            // Store settings in localStorage
            localStorage.setItem('dashboardSettings', JSON.stringify({
              refreshInterval: interval,
              autoScroll: autoScroll,
              soundAlerts: soundAlerts
            }));
            
            closeSettings();
            showNotification('Settings saved successfully!');
          }
          
          // Load saved settings on page load
          function loadSettings() {
            const savedSettings = localStorage.getItem('dashboardSettings');
            if (savedSettings) {
              const settings = JSON.parse(savedSettings);
              const refreshSelect = document.getElementById('refresh-interval');
              const autoScrollCheck = document.getElementById('auto-scroll');
              const soundAlertsCheck = document.getElementById('sound-alerts');
              
              if (refreshSelect) refreshSelect.value = settings.refreshInterval || '2';
              if (autoScrollCheck) autoScrollCheck.checked = settings.autoScroll !== false;
              if (soundAlertsCheck) soundAlertsCheck.checked = settings.soundAlerts || false;
              
              // Apply refresh interval
              const statsElement = document.getElementById('dashboard-stats');
              const intervalsElement = document.getElementById('live-intervals-data');
              
              if (statsElement) {
                statsElement.setAttribute('hx-trigger', 'load, every ' + settings.refreshInterval + 's');
              }
              if (intervalsElement) {
                intervalsElement.setAttribute('hx-trigger', 'load, every ' + settings.refreshInterval + 's, refresh');
              }
            }
          }
          
          // Make functions globally available
          window.showDriverDetails = showDriverDetails;
          window.closeDriverDetails = closeDriverDetails;
          window.toggleSettings = toggleSettings;
          window.closeSettings = closeSettings;
          window.toggleFullscreen = toggleFullscreen;
          window.showNotification = showNotification;
          window.saveSettings = saveSettings;
          window.loadSettings = loadSettings;
          
          // Load settings on page load
          loadSettings();
          
          // Event delegation for driver row clicks (survives HTMX updates)
          document.addEventListener('click', function(e) {
            const driverRow = e.target.closest('.driver-row');
            if (driverRow) {
              const driverData = JSON.parse(driverRow.getAttribute('data-driver'));
              console.log('Driver row clicked:', driverData.acronym);
              showDriverDetails(driverData);
            }
          });
          
          // HTMX event listeners to ensure functions remain available after content updates
          document.body.addEventListener('htmx:afterSwap', function(evt) {
            console.log('HTMX content updated, functions still available:', typeof window.showDriverDetails);
          });
        </script>
      `
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    
    // Fallback to basic layout if live data fails
    return MainLayout({
      title: "Live F1 Dashboard",
      children: html`
        <div class="min-h-screen bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Dashboard Unavailable</h1>
            <p class="text-gray-600 mb-4">Unable to load live F1 data. This could be because:</p>
            <ul class="text-left text-gray-600 mb-6 space-y-1">
              <li>• No active F1 session is currently running</li>
              <li>• The OpenF1 API is temporarily unavailable</li>
              <li>• Network connectivity issues</li>
            </ul>
            <button 
              onclick="window.location.reload()" 
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        
        <script>
          // Driver details functionality (moved from SidePanel to be globally available)
          function showDriverDetails(driverData) {
            console.log('showDriverDetails called with:', driverData);
            const card = document.getElementById('driver-details');
            const header = document.getElementById('driver-header');
            
            if (!card) {
              console.error('Driver details card not found');
              return;
            }
            
            // Update driver header styling with team color
            if (driverData.teamColor) {
              header.style.backgroundColor = '#' + driverData.teamColor + '20';
            }
            
            // Update driver avatar
            const headshot = document.getElementById('driver-headshot');
            const initials = document.getElementById('driver-initials');
            if (driverData.headshotUrl) {
              headshot.src = driverData.headshotUrl;
              headshot.classList.remove('hidden');
              initials.style.display = 'none';
            } else {
              headshot.classList.add('hidden');
              initials.textContent = driverData.acronym || driverData.name?.substring(0, 2) || '??';
              initials.style.display = 'flex';
              initials.style.backgroundColor = '#' + (driverData.teamColor || '6B7280');
            }
            
            // Update driver number styling
            const numberEl = document.getElementById('driver-number');
            numberEl.textContent = driverData.number || '?';
            numberEl.style.backgroundColor = '#' + (driverData.teamColor || '6B7280');
            
            // Update driver info
            document.getElementById('driver-acronym').textContent = driverData.acronym || '';
            document.getElementById('driver-name').textContent = driverData.name || 'Unknown Driver';
            document.getElementById('driver-team').textContent = driverData.team || 'Unknown Team';
            
            // Update driver stats
            document.getElementById('driver-position').textContent = driverData.position || '-';
            document.getElementById('driver-gap').textContent = driverData.gap || '-';
            document.getElementById('driver-last-lap').textContent = driverData.lastLap || '-';
            document.getElementById('driver-best-lap').textContent = driverData.bestLap || '-';
            document.getElementById('driver-speed').textContent = driverData.speed ? driverData.speed + ' km/h' : '- km/h';
            document.getElementById('driver-s1').textContent = driverData.s1 || '-';
            document.getElementById('driver-s2').textContent = driverData.s2 || '-';
            document.getElementById('driver-s3').textContent = driverData.s3 || '-';
            
            // Show the card
            card.classList.remove('hidden');
          }
          
          function closeDriverDetails() {
            const card = document.getElementById('driver-details');
            if (card) {
              card.classList.add('hidden');
            }
          }
          
          // Make functions globally available
          window.showDriverDetails = showDriverDetails;
          window.closeDriverDetails = closeDriverDetails;
          
          // Header button functions
          function toggleSettings() {
            document.getElementById('settings-modal').classList.remove('hidden');
          }
          
          function closeSettings() {
            document.getElementById('settings-modal').classList.add('hidden');
          }
          
          function toggleFullscreen() {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
              });
            } else {
              document.exitFullscreen();
            }
          }
          
          function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
              notification.remove();
            }, 3000);
          }
          
          function saveSettings() {
            const interval = document.getElementById('refresh-interval').value;
            const autoScroll = document.getElementById('auto-scroll').checked;
            const soundAlerts = document.getElementById('sound-alerts').checked;
            
            // Update HTMX trigger interval for both stats and intervals
            const statsElement = document.getElementById('dashboard-stats');
            const intervalsElement = document.getElementById('live-intervals-data');
            
            if (statsElement) {
              statsElement.setAttribute('hx-trigger', 'load, every ' + interval + 's');
            }
            if (intervalsElement) {
              intervalsElement.setAttribute('hx-trigger', 'load, every ' + interval + 's, refresh');
            }
            
            // Store settings in localStorage
            localStorage.setItem('dashboardSettings', JSON.stringify({
              refreshInterval: interval,
              autoScroll: autoScroll,
              soundAlerts: soundAlerts
            }));
            
            closeSettings();
            showNotification('Settings saved successfully!');
          }
          
          // Load saved settings on page load
          function loadSettings() {
            const savedSettings = localStorage.getItem('dashboardSettings');
            if (savedSettings) {
              const settings = JSON.parse(savedSettings);
              const refreshSelect = document.getElementById('refresh-interval');
              const autoScrollCheck = document.getElementById('auto-scroll');
              const soundAlertsCheck = document.getElementById('sound-alerts');
              
              if (refreshSelect) refreshSelect.value = settings.refreshInterval || '2';
              if (autoScrollCheck) autoScrollCheck.checked = settings.autoScroll !== false;
              if (soundAlertsCheck) soundAlertsCheck.checked = settings.soundAlerts || false;
              
              // Apply refresh interval
              const statsElement = document.getElementById('dashboard-stats');
              const intervalsElement = document.getElementById('live-intervals-data');
              
              if (statsElement) {
                statsElement.setAttribute('hx-trigger', 'load, every ' + settings.refreshInterval + 's');
              }
              if (intervalsElement) {
                intervalsElement.setAttribute('hx-trigger', 'load, every ' + settings.refreshInterval + 's, refresh');
              }
            }
          }
          
          // Make header functions globally available
          window.toggleSettings = toggleSettings;
          window.closeSettings = closeSettings;
          window.toggleFullscreen = toggleFullscreen;
          window.showNotification = showNotification;
        </script>
      `
    });
  }
};
