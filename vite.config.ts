
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// Add Electron scripts to package.json on startup
if (process.env.NODE_ENV !== 'production') {
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const needsUpdate = !packageJson.scripts['electron:start'];
    
    if (needsUpdate) {
      // Add the electron scripts
      packageJson.scripts['electron:dev'] = "concurrently \"cross-env ELECTRON_START_URL=http://localhost:8080 electron electron/main.js\" \"npm run dev\"";
      packageJson.scripts['electron:build'] = "npm run build && electron-builder";
      packageJson.scripts['electron:start'] = "electron electron/main.js";
      
      // Add electron-builder configuration
      if (!packageJson.build) {
        packageJson.build = {
          "appId": "com.buddyai.desktop",
          "productName": "Buddy AI",
          "files": [
            "dist/**/*",
            "electron/**/*"
          ],
          "directories": {
            "output": "release"
          },
          "mac": {
            "category": "public.app-category.productivity",
            "target": ["dmg"]
          },
          "win": {
            "target": ["nsis"]
          },
          "linux": {
            "target": ["AppImage", "deb"],
            "category": "Utility"
          }
        };
      }
      
      // Write the updated package.json
      fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
      console.log("Added Electron scripts to package.json");
    }
  } catch (error) {
    console.error("Failed to update package.json:", error);
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
