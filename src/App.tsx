import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameCanvas } from './components/GameCanvas';
import { useGame } from './hooks/useGame';
import { GameState } from './types';
import { Trophy, Coins, RotateCcw, Play, HelpCircle, X, Info } from 'lucide-react';
import { getPlatformHints, isTelegram } from './lib/platform';

export default function App() {
  const { gameData, startGame, jump } = useGame();
  const [showHelp, setShowHelp] = useState(false);
  const hints = getPlatformHints();

  // Handle Telegram WebApp expanded state
  useEffect(() => {
    if (isTelegram()) {
      const tg = (window as any).Telegram.WebApp;
      tg.expand();
      tg.ready();
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center font-sans select-none touch-none overflow-hidden"
      onPointerDown={(e) => {
        if (gameData.state === GameState.PLAYING && !showHelp) jump();
      }}
    >
      <div className="relative w-full max-w-[1000px] aspect-[10/6] p-4">
        {/* Game Area */}
        <GameCanvas data={gameData} />

        {/* HUD */}
        {gameData.state === GameState.PLAYING && (
          <div className="absolute top-8 left-8 right-8 flex justify-between pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-yellow-400" />
                <span className="font-mono text-xl font-bold">{gameData.panda.score.toString().padStart(5, '0')}</span>
              </div>
              <div className="w-[1px] h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Coins size={18} className="text-orange-400" />
                <span className="font-mono text-xl font-bold">{gameData.panda.coins}</span>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/60 text-sm font-medium">
              {hints.context} • HIGH: {gameData.highScore}
            </div>
          </div>
        )}

        {/* Overlays */}
        <AnimatePresence>
          {gameData.state === GameState.START && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
            >
              <div className="absolute top-8 right-8">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowHelp(true); }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
                >
                  <HelpCircle size={24} />
                </button>
              </div>

              <motion.h1 
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="text-7xl font-black text-white mb-2 tracking-tighter"
              >
                PANDA <span className="text-green-500">RUN</span>
              </motion.h1>
              
              <p className="text-white/40 mb-8 font-medium tracking-widest uppercase text-sm">
                Adventure in the Bamboo Forest
              </p>

              <button
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="group relative px-12 py-4 bg-green-500 hover:bg-green-400 text-white rounded-2xl font-bold text-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
              >
                <div className="flex items-center gap-3">
                  <Play fill="currentColor" />
                  START GAME
                </div>
              </button>

              <div className="mt-8 flex items-center gap-2 text-white/60 text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <span className="animate-pulse">●</span>
                {hints.start}
              </div>
            </motion.div>
          )}

          {gameData.state === GameState.GAME_OVER && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-xl"
            >
              <h2 className="text-5xl font-black text-red-500 mb-2">GAME OVER</h2>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 min-w-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60 uppercase text-xs font-black tracking-widest">Score</span>
                  <span className="text-4xl font-mono font-bold text-white leading-none">{gameData.panda.score}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60 uppercase text-xs font-black tracking-widest">Coins</span>
                  <span className="text-2xl font-mono font-bold text-orange-400 leading-none">{gameData.panda.coins}</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 uppercase text-xs font-black tracking-widest">Best</span>
                  <span className="text-xl font-mono font-bold text-green-400 leading-none">{gameData.highScore}</span>
                </div>
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="flex items-center gap-3 px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-2xl font-bold text-xl transition-all active:scale-95"
              >
                <RotateCcw size={20} />
                TRY AGAIN
              </button>
            </motion.div>
          )}

          {/* Help Modal */}
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xl rounded-xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#222] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
                <button 
                  onClick={() => setShowHelp(false)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                    <Info size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">How to Play</h3>
                </div>

                <div className="space-y-6 text-white/70">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <p><span className="text-white font-semibold">{hints.jump}</span>. You can double jump to reach higher coins or dodge tall obstacles!</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <p>Collect <span className="text-orange-400 font-semibold">Golden Bamboo Coins</span> for bonus points (+10 each).</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <p>Avoid the <span className="text-red-400 font-semibold">Bamboo Obstacles</span>. The speed increases as you run further!</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all"
                >
                  GOT IT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

