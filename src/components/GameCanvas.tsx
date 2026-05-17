import React, { useRef, useEffect, useState } from 'react';
import { GameData, GameState } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y } from '../constants';
import { ASSETS as ASSET_PATHS } from '../assets';

interface Props {
  data: GameData;
}

export const GameCanvas: React.FC<Props> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const loadImages = async () => {
      const loaded: Record<string, HTMLImageElement> = {};
      const promises = Object.entries(ASSET_PATHS).map(([key, src]) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loaded[key] = img;
            resolve();
          };
        });
      });
      await Promise.all(promises);
      setImages(loaded);
    };
    loadImages();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(images).length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw Background (Simple tiling/scrolling)
    const bgImg = images.BACKGROUND;
    if (bgImg) {
      const bgX = -(data.panda.distance * 0.5) % GAME_WIDTH;
      ctx.drawImage(bgImg, bgX, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.drawImage(bgImg, bgX + GAME_WIDTH, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Draw Ground
    ctx.fillStyle = '#4a7c44';
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

    // Draw Coins
    const coinImg = images.COIN;
    data.coins.forEach(coin => {
      if (!coin.collected && coinImg) {
        ctx.drawImage(coinImg, coin.pos.x, coin.pos.y, coin.size.width, coin.size.height);
      }
    });

    // Draw Obstacles
    const obsImg = images.OBSTACLE;
    data.obstacles.forEach(obs => {
      if (obsImg) {
        ctx.drawImage(obsImg, obs.pos.x, obs.pos.y, obs.size.width, obs.size.height);
      }
    });

    // Draw Panda
    const pandaImg = images.PANDA;
    if (pandaImg) {
      const frameIndex = Math.floor(data.panda.animationFrame);
      const frameWidth = pandaImg.width / 6; // Assuming 6 frames
      const frameHeight = pandaImg.height;

      ctx.save();
      ctx.translate(data.panda.pos.x + data.panda.size.width / 2, data.panda.pos.y + data.panda.size.height / 2);
      ctx.rotate(data.panda.rotation);
      
      ctx.drawImage(
        pandaImg,
        frameIndex * frameWidth, 0, frameWidth, frameHeight, // Source
        -data.panda.size.width / 2, -data.panda.size.height / 2, data.panda.size.width, data.panda.size.height // Destination
      );
      ctx.restore();
    }

    // Score Overlay (Internal Canvas HUD if needed, but let's use React for HUD)
    
  }, [data, images]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden rounded-xl shadow-2xl">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
