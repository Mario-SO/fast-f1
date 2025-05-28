import { Hono } from "hono";

// Import feature routes
import liveDashboardRoutes from "./features/live_dashboard/live_dashboard.routes.tsx"; // Adjusted path

const app = new Hono();

// --- Middleware ---
// Basic logger
app.use("*", async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  await next();
});

// Static file serving (if you have a public directory)
// app.use('/public/*', serveStatic({ root: './' }))
// app.get('/favicon.ico', serveStatic({ path: './public/images/favicon.ico' }))

// --- Feature Routes ---
// Mount the live dashboard routes under the /live path
app.route("/live", liveDashboardRoutes);

// --- Root/Other Routes ---
app.get("/", (c) => {
  // return c.text("Welcome to Fast F1! Visit /live for the dashboard.");
  // Redirect to /live for now
  return c.redirect("/live", 302);
});

// Handle 404s for unhandled routes
app.notFound((c) => {
  return c.html(
    `<h1>404 - Not Found</h1><p>The page ${c.req.url} could not be found.</p><a href="/live">Go to Live Dashboard</a>`,
    404,
  );
});

// --- Error Handling ---
app.onError((err, c) => {
  console.error(`${err}`);
  return c.html(`<h1>Application Error</h1><p>${err.message}</p>`, 500);
});

console.log("Server starting on http://localhost:8000 ...");
Deno.serve(app.fetch);
