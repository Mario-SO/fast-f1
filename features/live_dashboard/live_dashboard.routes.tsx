import { Hono } from "hono";
import { LiveDashboardPage } from "./views/LiveDashboardPage.tsx";
import { LiveDashboardService } from "./services/live_dashboard.service.ts";
import { DriverRow } from "./views/components/DriverRow.tsx";
import { StatsGrid } from "./views/components/StatsGrid.tsx";

const liveRoutes = new Hono();

// Route for the main /live page
liveRoutes.get("/", async (c) => {
  return c.html(await LiveDashboardPage());
});

// Enhanced API endpoint for htmx with live driver data
liveRoutes.get("/api/intervals", async (c) => {
  try {
    const sessionKey = c.req.query('session_key') ? parseInt(c.req.query('session_key')!) : undefined;
    console.log('API /intervals called with sessionKey:', sessionKey);
    
    const drivers = await LiveDashboardService.getDriversWithLiveData(sessionKey);
    console.log('API /intervals: Got', drivers.length, 'drivers');
    
    const { left, right } = LiveDashboardService.splitDriversIntoColumns(drivers);
    console.log('API /intervals: Split into', left.length, 'left and', right.length, 'right');

    return c.html(`
      <div class="grid grid-cols-2 gap-4">
        <!-- Left Column (Positions 1-10) -->
        <div class="space-y-1">
          ${left.map((driver, index) => DriverRow({ driver, index })).join("")}
        </div>
        <!-- Right Column (Positions 11-20) -->
        <div class="space-y-1">
          ${right.map((driver, index) => DriverRow({ driver, index: index + left.length })).join("")}
        </div>
      </div>
    `);
  } catch (error) {
    console.error('Error fetching intervals:', error);
    return c.html(`<div class="text-red-500 p-4">Error loading live data. Please try again.</div>`);
  }
});

// API endpoint for dashboard stats
liveRoutes.get("/api/stats", async (c) => {
  try {
    const sessionKey = c.req.query('session_key') ? parseInt(c.req.query('session_key')!) : undefined;
    const stats = await LiveDashboardService.getDashboardStats(sessionKey);
    
    return c.html(StatsGrid({ stats }));
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.html(`<div class="text-red-500 p-4">Error loading stats. Please try again.</div>`);
  }
});

export default liveRoutes;
