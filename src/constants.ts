export const GAME_WIDTH = 1000;
export const GAME_HEIGHT = 600;
export const GROUND_HEIGHT = 50;
export const GROUND_Y = GAME_HEIGHT - GROUND_HEIGHT;

export const PHYSICS = {
  GRAVITY: 0.8,
  JUMP_FORCE: -18,
  DOUBLE_JUMP_FORCE: -15,
  INITIAL_SPEED: 6,
  SPEED_INCREMENT: 0.0005,
  MAX_SPEED: 12,
};

export const ASSET_SIZES = {
  PANDA: { width: 80, height: 80 },
  OBSTACLE: { width: 60, height: 80 },
  COIN: { width: 40, height: 40 },
};
