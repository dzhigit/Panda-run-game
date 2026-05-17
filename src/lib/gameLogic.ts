import { GameData, GameState, Panda, Obstacle, Coin } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, PHYSICS, ASSET_SIZES } from '../constants';

export const createInitialPanda = (): Panda => ({
  id: 'panda',
  pos: { x: 100, y: GROUND_Y - ASSET_SIZES.PANDA.height },
  size: { width: ASSET_SIZES.PANDA.width, height: ASSET_SIZES.PANDA.height },
  vy: 0,
  isJumping: false,
  canDoubleJump: true,
  rotation: 0,
  score: 0,
  coins: 0,
  distance: 0,
  animationFrame: 0,
});

export const createInitialGameData = (highScore: number = 0): GameData => ({
  state: GameState.START,
  panda: createInitialPanda(),
  obstacles: [],
  coins: [],
  speed: PHYSICS.INITIAL_SPEED,
  highScore,
});

export const updateGame = (data: GameData, deltaTime: number): GameData => {
  if (data.state !== GameState.PLAYING) return data;

  const newData = { ...data };
  const { panda, obstacles, coins, speed } = newData;

  // Update speed
  newData.speed = Math.min(PHYSICS.MAX_SPEED, speed + PHYSICS.SPEED_INCREMENT * deltaTime);

  // Update Panda Physics
  panda.vy += PHYSICS.GRAVITY;
  panda.pos.y += panda.vy;

  if (panda.pos.y > GROUND_Y - panda.size.height) {
    panda.pos.y = GROUND_Y - panda.size.height;
    panda.vy = 0;
    panda.isJumping = false;
    panda.canDoubleJump = true;
    panda.rotation = 0;
    
    // Update animation frame based on speed
    panda.animationFrame = (panda.animationFrame + 0.15 * (newData.speed / PHYSICS.INITIAL_SPEED)) % 6;
  } else {
    // Basic rotation while jumping
    panda.rotation += 0.05;
    panda.animationFrame = 0; // Reset or keep a specific jump frame
  }

  panda.distance += newData.speed;
  panda.score = Math.floor(panda.distance / 100);

  // Update Obstacles
  newData.obstacles = obstacles
    .map(obs => ({ ...obs, pos: { ...obs.pos, x: obs.pos.x - newData.speed } }))
    .filter(obs => obs.pos.x + obs.size.width > -100);

  // Update Coins
  newData.coins = coins
    .map(coin => ({ ...coin, pos: { ...coin.pos, x: coin.pos.x - newData.speed } }))
    .filter(coin => coin.pos.x + coin.size.width > -100 && !coin.collected);

  // Spawning logic
  const lastObstacle = obstacles[obstacles.length - 1];
  if (!lastObstacle || lastObstacle.pos.x < GAME_WIDTH - 400 - Math.random() * 400) {
    const newObs: Obstacle = {
      id: Math.random().toString(36).substr(2, 9),
      pos: { x: GAME_WIDTH, y: GROUND_Y - ASSET_SIZES.OBSTACLE.height },
      size: { ...ASSET_SIZES.OBSTACLE },
      type: 'bamboo',
      passed: false,
    };
    newData.obstacles.push(newObs);
  }

  const lastCoin = coins[coins.length - 1];
  if (!lastCoin || lastCoin.pos.x < GAME_WIDTH - 200 - Math.random() * 200) {
    if (Math.random() > 0.7) {
      const newCoin: Coin = {
        id: Math.random().toString(36).substr(2, 9),
        pos: { x: GAME_WIDTH, y: GROUND_Y - 150 - Math.random() * 150 },
        size: { ...ASSET_SIZES.COIN },
        collected: false,
      };
      newData.coins.push(newCoin);
    }
  }

  // Collision Detection
  for (const obs of newData.obstacles) {
    if (checkCollision(panda, obs)) {
      newData.state = GameState.GAME_OVER;
      if (panda.score > newData.highScore) {
        newData.highScore = panda.score;
      }
      break;
    }
  }

  if (newData.state === GameState.PLAYING) {
    for (const coin of newData.coins) {
      if (!coin.collected && checkCollision(panda, coin)) {
        coin.collected = true;
        panda.coins += 1;
        panda.score += 10; // Bonus score for coins
      }
    }
  }

  return newData;
};

const checkCollision = (a: any, b: any) => {
  // Padding for more forgiving collisions
  const paddingX = 10;
  const paddingY = 10;
  return (
    a.pos.x + paddingX < b.pos.x + b.size.width - paddingX &&
    a.pos.x + a.size.width - paddingX > b.pos.x + paddingX &&
    a.pos.y + paddingY < b.pos.y + b.size.height - paddingY &&
    a.pos.y + a.size.height - paddingY > b.pos.y + paddingY
  );
};
