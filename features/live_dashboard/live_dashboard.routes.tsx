import { Hono } from "hono";
import { LiveDashboardPage } from "./views/LiveDashboardPage.tsx";

const liveRoutes = new Hono();

// Route for the main /live page
liveRoutes.get("/", (c) => {
  return c.html(LiveDashboardPage());
});

// Enhanced API endpoint for htmx with all 20 F1 drivers in 2-column layout
liveRoutes.get("/api/intervals", (c) => {
  const mockDrivers = [
    {
      pos: 1,
      driver: "VER",
      team: "Red Bull",
      gap: "Leader",
      lastLap: "1:18.456",
      status: "green",
    },
    {
      pos: 2,
      driver: "LEC",
      team: "Ferrari",
      gap: "+0.333",
      lastLap: "1:18.789",
      status: "green",
    },
    {
      pos: 3,
      driver: "HAM",
      team: "Mercedes",
      gap: "+0.667",
      lastLap: "1:19.123",
      status: "yellow",
    },
    {
      pos: 4,
      driver: "RUS",
      team: "Mercedes",
      gap: "+1.000",
      lastLap: "1:19.456",
      status: "green",
    },
    {
      pos: 5,
      driver: "SAI",
      team: "Ferrari",
      gap: "+1.333",
      lastLap: "1:19.789",
      status: "green",
    },
    {
      pos: 6,
      driver: "NOR",
      team: "McLaren",
      gap: "+1.667",
      lastLap: "1:20.123",
      status: "green",
    },
    {
      pos: 7,
      driver: "PIA",
      team: "McLaren",
      gap: "+2.000",
      lastLap: "1:20.456",
      status: "green",
    },
    {
      pos: 8,
      driver: "ALO",
      team: "Aston Martin",
      gap: "+2.333",
      lastLap: "1:20.789",
      status: "green",
    },
    {
      pos: 9,
      driver: "STR",
      team: "Aston Martin",
      gap: "+2.667",
      lastLap: "1:21.123",
      status: "green",
    },
    {
      pos: 10,
      driver: "GAS",
      team: "Alpine",
      gap: "+3.000",
      lastLap: "1:21.456",
      status: "green",
    },
    {
      pos: 11,
      driver: "OCO",
      team: "Alpine",
      gap: "+3.333",
      lastLap: "1:21.789",
      status: "green",
    },
    {
      pos: 12,
      driver: "ALB",
      team: "Williams",
      gap: "+3.667",
      lastLap: "1:22.123",
      status: "green",
    },
    {
      pos: 13,
      driver: "SAR",
      team: "Williams",
      gap: "+4.000",
      lastLap: "1:22.456",
      status: "green",
    },
    {
      pos: 14,
      driver: "TSU",
      team: "AlphaTauri",
      gap: "+4.333",
      lastLap: "1:22.789",
      status: "green",
    },
    {
      pos: 15,
      driver: "RIC",
      team: "AlphaTauri",
      gap: "+4.667",
      lastLap: "1:23.123",
      status: "green",
    },
    {
      pos: 16,
      driver: "BOT",
      team: "Alfa Romeo",
      gap: "+5.000",
      lastLap: "1:23.456",
      status: "green",
    },
    {
      pos: 17,
      driver: "ZHO",
      team: "Alfa Romeo",
      gap: "+5.333",
      lastLap: "1:23.789",
      status: "green",
    },
    {
      pos: 18,
      driver: "HUL",
      team: "Haas",
      gap: "+5.667",
      lastLap: "1:24.123",
      status: "green",
    },
    {
      pos: 19,
      driver: "MAG",
      team: "Haas",
      gap: "+6.000",
      lastLap: "1:24.456",
      status: "green",
    },
    {
      pos: 20,
      driver: "PER",
      team: "Red Bull",
      gap: "+1 LAP",
      lastLap: "1:25.789",
      status: "red",
    },
  ];

  // Split drivers into two columns
  const leftColumn = mockDrivers.slice(0, 10);
  const rightColumn = mockDrivers.slice(10, 20);

  const generateDriverRow = (driver: any) => `
    <div class="flex items-center space-x-2 py-1.5 hover:bg-gray-50 rounded transition-colors">
      <span class="w-6 text-xs font-mono font-bold text-gray-600">${driver.pos}</span>
      <span class="w-8 text-xs font-bold text-gray-900">${driver.driver}</span>
      <div class="flex-1 min-w-0">
        <span class="text-xs text-gray-600 truncate block">${driver.team}</span>
      </div>
      <span class="w-16 text-xs font-mono text-right ${
    driver.gap === "Leader"
      ? "text-blue-600 font-semibold"
      : driver.gap.includes("LAP")
      ? "text-red-600"
      : "text-gray-900"
  }">${driver.gap}</span>
      <div class="w-2 h-2 rounded-full ${
    driver.status === "green"
      ? "bg-green-400"
      : driver.status === "yellow"
      ? "bg-yellow-400"
      : "bg-red-400"
  }"></div>
    </div>
  `;

  return c.html(`
    <div class="grid grid-cols-2 gap-4">
      <!-- Left Column (Positions 1-10) -->
      <div class="space-y-1">
        ${leftColumn.map(generateDriverRow).join("")}
      </div>
      <!-- Right Column (Positions 11-20) -->
      <div class="space-y-1">
        ${rightColumn.map(generateDriverRow).join("")}
      </div>
    </div>
  `);
});

export default liveRoutes;
