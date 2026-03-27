import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  // Use path.resolve to find the dist/public directory accurately on Render
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    // If that fails, try a fallback for local development
    const localPath = path.resolve(process.cwd(), "public");
    if (!fs.existsSync(localPath)) {
      throw new Error(
        `Could not find the build directory at ${distPath} or ${localPath}. Make sure to build the client first`,
      );
    }
  }

  app.use(express.static(distPath));

  // Handle Client-Side Routing: fallback to index.html
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}