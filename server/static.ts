import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  // 1. Log the path for debugging
  console.log(`[Static] Looking for assets in: ${distPath}`);

  // 2. Serve all files from dist/public (including index.css and JS files)
  app.use(express.static(distPath));

  // 3. Fallback for SPA (Single Page Application) routing
  app.use("*", (req, res, next) => {
    // Skip API calls
    if (req.path.startsWith("/api")) {
      return next();
    }

    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Front-end build files not found in dist/public");
    }
  });
}