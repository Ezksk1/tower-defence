"use client";

import { useRef, useEffect, useCallback } from "react";
import type { GameState } from "@/lib/types";
import { GAME_CONFIG, LEVELS } from "@/lib/game-config";
import { useToast } from "@/hooks/use-toast";

interface GameBoardProps {
  gameState: GameState;
  onDrop: (gridX: number, gridY: number) => void;
}

export default function GameBoard({ gameState, onDrop }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const drawPath = useCallback((ctx: CanvasRenderingContext2D) => {
    const path = LEVELS[gameState.currentLevel - 1].path;
    if (!path || path.length === 0) return;
    
    ctx.strokeStyle = '#B0BEC5';
    ctx.lineWidth = GAME_CONFIG.CELL_WIDTH - 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(path[0].x * GAME_CONFIG.CELL_WIDTH + GAME_CONFIG.CELL_WIDTH/2, path[0].y * GAME_CONFIG.CELL_HEIGHT + GAME_CONFIG.CELL_HEIGHT/2);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x * GAME_CONFIG.CELL_WIDTH + GAME_CONFIG.CELL_WIDTH/2, path[i].y * GAME_CONFIG.CELL_HEIGHT + GAME_CONFIG.CELL_HEIGHT/2);
    }
    ctx.stroke();

    // Cracked ice effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 10]);
     ctx.stroke();
    ctx.setLineDash([]);
  }, [gameState.currentLevel]);

  const drawTowers = useCallback((ctx: CanvasRenderingContext2D) => {
    gameState.towers.forEach(tower => {
      ctx.fillStyle = '#607D8B';
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#37474F';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw range indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
      ctx.stroke();
    });
  }, [gameState.towers]);

  const drawEnemies = useCallback((ctx: CanvasRenderingContext2D) => {
    gameState.enemies.forEach(enemy => {
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Health bar
      const healthPercentage = enemy.currentHp / enemy.hp(gameState.wave);
      ctx.fillStyle = '#76FF03';
      ctx.fillRect(enemy.x - 15, enemy.y - 20, 30 * healthPercentage, 5);
      ctx.strokeStyle = '#263238';
      ctx.strokeRect(enemy.x - 15, enemy.y - 20, 30, 5);
    });
  }, [gameState.enemies, gameState.wave]);

  const drawDecorations = useCallback((ctx: CanvasRenderingContext2D) => {
    // Simple placeholder for decorations
    ctx.fillStyle = 'green';
    ctx.fillRect(50, 50, 20, 30); // A tree
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(100, 100, 10, 0, Math.PI * 2);
    ctx.fill(); // An ornament
  }, []);

  const drawPausedOverlay = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, GAME_CONFIG.GRID_WIDTH, GAME_CONFIG.GRID_HEIGHT);
    ctx.font = "bold 60px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", GAME_CONFIG.GRID_WIDTH / 2, GAME_CONFIG.GRID_HEIGHT / 2);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#90A4AE';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawPath(ctx);
    drawDecorations(ctx); // Draw decorations under towers/enemies
    drawTowers(ctx);
    drawEnemies(ctx);

    if (gameState.status === 'paused') {
      drawPausedOverlay(ctx);
    }
  }, [gameState, drawPath, drawTowers, drawEnemies, drawDecorations, drawPausedOverlay]);

  const handleDragOver = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };

  const handleDropEvent = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.floor(x / GAME_CONFIG.CELL_WIDTH);
    const gridY = Math.floor(y / GAME_CONFIG.CELL_HEIGHT);
    
    if (gridX < 0 || gridX >= GAME_CONFIG.GRID_COLS || gridY < 0 || gridY >= GAME_CONFIG.GRID_ROWS) {
        return;
    }

    onDrop(gridX, gridY);
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-card rounded-lg border">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.GRID_WIDTH}
        height={GAME_CONFIG.GRID_HEIGHT}
        className="rounded-lg"
        onDragOver={handleDragOver}
        onDrop={handleDropEvent}
      />
    </div>
  );
}
