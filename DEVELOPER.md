# Panda Run - Developer Documentation

Welcome to the development guide for **Panda Run**. This project is a modern TypeScript/React reimagining of a classic parkour game.

## 🏗️ Architecture Overview

The application follows a clean React architecture with a clear separation between game logic and presentation.

### 📁 Project Structure

-   `src/components/`: React UI components.
    -   `GameCanvas.tsx`: The core rendering engine using HTML5 Canvas.
-   `src/lib/`: Pure utility functions and core game logic.
    -   `gameLogic.ts`: Contains the `updateGame` loop, physics, collision detection, and entity spawning.
    -   `platform.ts`: Telegram Mini App detection and platform-specific helpers.
-   `src/hooks/`: Custom React hooks.
    -   `useGame.ts`: Manages the game loop state, requestAnimationFrame, and user input listeners.
-   `src/assets/`: Static assets (images generated via AI).
-   `src/types.ts`: Global TypeScript interfaces and enums.
-   `src/constants.ts`: Physic constants and game configuration.

## 🎮 Game Engine Logic

The game uses a **deterministic update loop** synchronized to the browser's refresh rate (via `requestAnimationFrame`).

### 1. The Game Loop (`useGame.ts`)
The `updateGame` function is called every frame. It calculates the `deltaTime` to ensure smooth movement regardless of the frame rate.

### 2. Physics (`gameLogic.ts`)
-   **Gravity**: Applied to the Panda every frame.
-   **Jumping**: A simple vertical velocity change.
-   **Double Jump**: Tracked via `canDoubleJump` boolean on the Panda entity.

### 3. Collision Detection
Collisions are calculated using **Axis-Aligned Bounding Box (AABB)** detection with `padding` to make the game feel "fair" (forgiving hitboxes).

## 🚀 Telegram Integration

The app is built as a **Telegram Mini App** (TWA). It includes:
-   Automatic `expand()` to use the full screen.
-   Platform-specific hints (Touch vs. Desktop).
-   Detection of the `window.Telegram` object.

## 🛠️ Adding New Features

### To add a new obstacle type:
1.  Update `Obstacle` interface in `types.ts`.
2.  Add a new asset path in `assets.ts`.
3.  Modify `updateGame` in `gameLogic.ts` to include your new spawning logic.
4.  Update the rendering in `GameCanvas.tsx`.

### To add power-ups:
1.  Create a `PowerUp` interface in `types.ts`.
2.  Add a `powerups` array to `GameData`.
3.  Implement collision and effect logic in `gameLogic.ts`.

## 🎨 Styling

We use **Tailwind CSS 4.0** with **Motion (formerly Framer Motion)** for high-quality UI animations. Global styles and custom fonts (Inter & JetBrains Mono) are configured in `src/index.css`.

---

*Developer: AI Coding Agent (Antigravity)*
