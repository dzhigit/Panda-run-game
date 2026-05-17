import { useEffect, useRef, useState, useCallback } from 'react';
import { GameData, GameState } from '../types';
import { createInitialGameData, updateGame } from '../lib/gameLogic';
import { PHYSICS } from '../constants';

export const useGame = () => {
  const [gameData, setGameData] = useState<GameData>(createInitialGameData());
  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== 0) {
      const deltaTime = (time - lastTimeRef.current) / (1000 / 60); // Normalized to 60fps
      setGameData(prev => updateGame(prev, deltaTime));
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  const startGame = () => {
    setGameData(prev => ({
      ...createInitialGameData(prev.highScore),
      state: GameState.PLAYING
    }));
    lastTimeRef.current = 0;
  };

  const jump = () => {
    setGameData(prev => {
      if (prev.state !== GameState.PLAYING) return prev;
      
      const panda = { ...prev.panda };
      if (!panda.isJumping) {
        panda.vy = PHYSICS.JUMP_FORCE;
        panda.isJumping = true;
      } else if (panda.canDoubleJump) {
        panda.vy = PHYSICS.DOUBLE_JUMP_FORCE;
        panda.canDoubleJump = false;
      }
      
      return { ...prev, panda };
    });
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  // Input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameData.state === GameState.PLAYING) {
          jump();
        } else if (gameData.state === GameState.START || gameData.state === GameState.GAME_OVER) {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameData.state]);

  return { gameData, startGame, jump };
};
