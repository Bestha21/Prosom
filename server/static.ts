import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try to find the absolute path to the 'dist/public' folder
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const fallbackPath = path.resolve(__dirname, "..", "dist", "public");

  let finalPath = distPath;

  if (!fs.existsSync(distPath)) {
    if (fs.existsSync(fallbackPath)) {
      finalPath = fallbackPath;
    } else {
      console.error(`Directory missing. CWD: ${process.cwd()}, Dirname: ${__dirname}`);
      // Don't throw yet, let the logs show us what's happening
    }
  }

  app.use(express.static(finalPath));

  app.use("*", (req, res, next) => {
    // If it's an API call, don't send index.html
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.resolve(finalPath, "index.html"), (err) => {
      if (err) {
        res.status(404).send("Front-end build files not found. Please check dist/public.");
      }
    });
  });
}