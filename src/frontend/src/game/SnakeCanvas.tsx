import React, { useRef, useEffect, useState } from 'react';
import type { GameState } from './useImpulseSnake';

interface SnakeCanvasProps {
  gameState: GameState;
  gridSize: number;
  cellSize: number;
}

export function SnakeCanvas({ gameState, gridSize }: SnakeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(600); // Default larger size

  // Measure container and set responsive canvas size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      // Use the smaller dimension to maintain square aspect ratio
      const size = Math.min(containerWidth, containerHeight);
      setCanvasSize(size);
    };

    // Initial size
    updateSize();

    // Observe container size changes
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    // Also listen to window resize for good measure
    window.addEventListener('resize', updateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas pixel buffer accounting for device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    
    // Reset transform to identity before scaling to prevent cumulative scaling
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Calculate cell size based on canvas size
    const cellSize = canvasSize / gridSize;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }

    // Draw food with glow
    const food = gameState.food;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      
      if (isHead) {
        // Head with glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#22c55e';
        ctx.fillStyle = '#22c55e';
      } else {
        // Body gradient
        const alpha = 1 - (index / gameState.snake.length) * 0.5;
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      }

      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );

      if (isHead) {
        ctx.shadowBlur = 0;
      }
    });
  }, [gameState, gridSize, canvasSize]);

  return (
    <div ref={containerRef} className="game-playfield-wrapper">
      <canvas
        ref={canvasRef}
        style={{ width: canvasSize, height: canvasSize }}
        className="border-2 border-primary rounded-lg shadow-glow"
      />
    </div>
  );
}
