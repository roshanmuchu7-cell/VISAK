import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction, GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../types';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  primaryColor: string;
}

export default function SnakeGame({ onScoreChange, primaryColor }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
       ctx.beginPath();
       ctx.moveTo(i * cellSize, 0);
       ctx.lineTo(i * cellSize, canvas.height);
       ctx.stroke();
       ctx.beginPath();
       ctx.moveTo(0, i * cellSize);
       ctx.lineTo(canvas.width, i * cellSize);
       ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? primaryColor : `${primaryColor}aa`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = primaryColor;
      
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#fefe33'; // Neon yellow
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#fefe33';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.shadowBlur = 0; // Reset shadow for next frame
  }, [snake, food, primaryColor]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-[400px] font-mono text-sm">
        <div className="flex items-center gap-2">
           <span className="text-gray-400">SCORE:</span>
           <span className="text-neon-cyan font-bold tabular-nums">{score.toString().padStart(5, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-gray-400">STATUS:</span>
           <span className={`${isPaused ? 'text-neon-yellow' : 'text-green-400'} font-bold`}>
             {isPaused ? 'PAUSED' : 'LIVE'}
           </span>
        </div>
      </div>

      <div 
        className="relative border-2 border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm"
        style={{ boxShadow: `0 0 30px ${primaryColor}22` }}
      >
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="block"
        />

        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
            >
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-bold text-red-500 mb-2 neon-glow-magenta font-mono">GAME OVER</h2>
                  <p className="text-gray-300 mb-6">Your Final Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    TRY AGAIN
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-white mb-6 font-mono tracking-widest">PAUSED</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
                  >
                    CONTINUE
                  </button>
                  <button 
                    onClick={resetGame}
                    className="mt-4 text-xs text-white/40 hover:text-white/80"
                  >
                    RESTART
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
         <div className="flex items-center gap-1"><span className="bg-white/10 px-1 rounded">ARROWS</span> MOVE</div>
         <div className="flex items-center gap-1"><span className="bg-white/10 px-1 rounded">SPACE</span> PAUSE</div>
      </div>
    </div>
  );
}
