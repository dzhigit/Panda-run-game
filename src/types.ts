export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Entity {
  id: string;
  pos: Vector2;
  size: Size;
}

export interface Panda extends Entity {
  vy: number;
  isJumping: boolean;
  canDoubleJump: boolean;
  rotation: number;
  score: number;
  coins: number;
  distance: number;
  animationFrame: number;
}

export interface Obstacle extends Entity {
  type: 'bamboo' | 'rock';
  passed: boolean;
}

export interface Coin extends Entity {
  collected: boolean;
}

export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
}

export interface GameData {
  state: GameState;
  panda: Panda;
  obstacles: Obstacle[];
  coins: Coin[];
  speed: number;
  highScore: number;
}
