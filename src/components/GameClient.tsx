"use client";

import { useState, useCallback } from "react";
import type { GameState, PlacedTower, TowerData } from "@/lib/types";
import { GAME_CONFIG, LEVELS, TOWERS, ENEMIES_BY_WAVE, ENEMIES } from "@/lib/game-config";
import GameBoard from "./GameBoard";
import GameSidebar from "./GameSidebar";
import GameControls from "./GameControls";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useToast } from "@/hooks/use-toast";

const initialGameState: GameState = {
  status: "playing",
  lives: GAME_CONFIG.STARTING_LIVES,
  money: GAME_CONFIG.STARTING_MONEY,
  wave: 1,
  currentLevel: 1,
  waveTimer: GAME_CONFIG.WAVE_TIMER_DURATION,
  towers: [],
  enemies: [],
  projectiles: [],
  decorations: [], // This will be populated in a useEffect
};

export default function GameClient() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [draggingTower, setDraggingTower] = useState<TowerData | null>(null);
  const { toast } = useToast();

  const isCellOccupied = useCallback((gridX: number, gridY: number, towers: PlacedTower[]) => {
    return towers.some(t => t.gridX === gridX && t.gridY === gridY);
  }, []);

  const handleStartWave = useCallback(() => {
    if (gameState.status !== "playing") return;

    setGameState(prev => {
      const waveEnemies = (ENEMIES_BY_WAVE[prev.wave] || []).map((enemyId, index) => {
          const enemyData = ENEMIES[enemyId];
          const path = LEVELS[prev.currentLevel - 1].path;
          const totalHp = enemyData.hp(prev.wave);
          return {
              ...enemyData,
              idInGame: `${prev.wave}-${index}`,
              x: path[0].x - (index * 40), // Stagger spawn
              y: path[0].y,
              currentHp: totalHp,
              totalHp: totalHp,
              pathIndex: 0,
          };
      });

      return {
          ...prev,
          status: "playing",
          enemies: waveEnemies,
          waveTimer: 0,
      };
    });
  }, [gameState.status]);

  useGameLoop(gameState, setGameState, handleStartWave);

  const handlePause = () => {
    setGameState((prev) => ({
      ...prev,
      status: prev.status === "paused" ? "playing" : "paused",
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem("td_save_realistic", JSON.stringify(gameState));
      toast({ title: "Game Saved", description: "Your progress has been saved." });
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: "Could not save game data." });
    }
  };

  const handleLoad = () => {
    try {
      const savedState = localStorage.getItem("td_save_realistic");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setGameState({...parsedState, status: 'paused'}); // Load in paused state
        toast({ title: "Game Loaded", description: "Your progress has been restored." });
      } else {
        toast({ variant: "destructive", title: "Load Failed", description: "No saved game found." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Load Failed", description: "Could not load saved data." });
    }
  };

  const handleDragStart = (tower: TowerData) => {
    if (gameState.money >= tower.cost) {
      setDraggingTower(tower);
    }
  };

  const handleDrop = (gridX: number, gridY: number) => {
    if (!draggingTower) return;
    
    const path = LEVELS[gameState.currentLevel - 1].path;
    const isOnPath = path.some(p => p.x === gridX && p.y === gridY);
    
    if (isOnPath || isCellOccupied(gridX, gridY, gameState.towers)) {
       toast({ variant: "destructive", title: "Placement Error", description: "Cannot place tower here." });
       setDraggingTower(null);
       return;
    }

    setGameState((prev) => ({
      ...prev,
      money: prev.money - draggingTower.cost,
      towers: [
        ...prev.towers,
        {
          ...TOWERS[draggingTower.id],
          idInGame: crypto.randomUUID(),
          x: gridX * GAME_CONFIG.CELL_WIDTH + GAME_CONFIG.CELL_WIDTH / 2,
          y: gridY * GAME_CONFIG.CELL_HEIGHT + GAME_CONFIG.CELL_HEIGHT / 2,
          gridX,
          gridY,
          cooldown: 0,
        },
      ],
    }));
    setDraggingTower(null);
  };
  
  const handleNextLevel = () => {
    setGameState(prev => {
        const nextLevel = prev.currentLevel + 1 > LEVELS.length ? prev.currentLevel : prev.currentLevel + 1;
        return {
            ...initialGameState,
            wave: prev.wave,
            currentLevel: nextLevel,
            money: prev.money + 500, // Level completion bonus
        }
    });
  }

  return (
    <div className="flex w-full max-w-[1600px] mx-auto p-4 gap-4 h-[calc(100vh-2rem)]">
      <div className="flex-grow flex flex-col gap-4">
        <GameControls
          onPause={handlePause}
          onSave={handleSave}
          onLoad={handleLoad}
          onStartWave={handleStartWave}
          gameState={gameState}
        />
        <GameBoard gameState={gameState} onDrop={handleDrop} />
      </div>
      <GameSidebar gameState={gameState} onDragStart={handleDragStart} />
    </div>
  );
}
