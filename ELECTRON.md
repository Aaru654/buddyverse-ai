
# Buddy AI Desktop App

This application has been converted to run as a desktop application using Electron, which allows it to access system resources like the terminal, file system, etc.

## Development

To run the app in development mode:

```bash
npm run electron:dev
```

This will start both the Vite development server and Electron, connecting them together.

## Building for Production

To build the app for production:

```bash
npm run electron:build
```

This will create distributable packages in the `release` folder, appropriate for your operating system.

## Running the Production Build

To run the app from the production build:

```bash
npm run electron:start
```

## Features Added by Desktop Integration

The desktop version of Buddy AI can:

1. Execute terminal commands
2. Access the file system (create, delete, rename, and open files/folders)
3. Get system information
4. Run native applications

More system integration features can be added by extending the IPC handlers in `electron/main.js` and exposing them via `electron/preload.js`.
