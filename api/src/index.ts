import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import healthRoutes from "./routes/health.js";
import { fileURLToPath } from "url";
import userRoutes from "./routes/users.routes.js";

export const app = new Hono();

// Middleware
app.use("*", logger());

// Routes
app.route("/api/health", healthRoutes);
app.route("/api/users", userRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  serve(
    {
      fetch: app.fetch,
      port: PORT,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    }
  );
}

// Check if file is being executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}
