
// This file is just for reference, to be manually applied to package.json
// These are the scripts that need to be added:
/*
"electron:dev": "concurrently \"cross-env ELECTRON_START_URL=http://localhost:8080 electron electron/main.js\" \"npm run dev\"",
"electron:build": "npm run build && electron-builder",
"electron:start": "electron electron/main.js",
*/

// electron-builder configuration to be added to package.json:
/*
"build": {
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
}
*/
