import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  // 1. Log for debugging (you'll see this in Render Logs)
  console.log(`[Static] Serving assets from: ${distPath}`);

  // 2. Serve static files from the build directory
  // This handles the /assets/ folder and favicon.png
  app.use(express.static(distPath));

  // 3. Explicitly handle the /assets route just in case
  app.use("/assets", express.static(path.resolve(distPath, "assets")));

  // 4. Fallback for Single Page Application (SPA) routing
  app.use("*", (req, res, next) => {
    // Skip API routes so they return proper 404s/errors
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Front-end build not found in dist/public");
    }
  });
}