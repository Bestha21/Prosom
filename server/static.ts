import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  // Use process.cwd() to get the project root accurately on Render
  const distPath = path.resolve(process.cwd(), "dist", "public");

  // Serve static files from dist/public
  app.use(express.static(distPath));

  // Explicitly serve the assets folder
  app.use("/assets", express.static(path.resolve(distPath, "assets")));

  app.use("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Build assets not found. Please check dist/public.");
    }
  });
}