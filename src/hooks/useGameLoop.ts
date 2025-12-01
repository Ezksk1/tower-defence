"use client";

import { useEffect, useRef, useCallback } from "react";
import type { GameState } from "@/lib/types";
import { LEVELS } from "@/lib/game-config";

const FRAME_TIME = 1000 / 60; // 60 FPS

export function useGameLoop(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  handleStartWave: () => void
) {
  const lastFrameTimeRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);

  const gameLoop = useCallback((timestamp: number) => {
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = timestamp;
    }

    let deltaTime = timestamp - lastFrameTimeRef.current;
    lastFrameTimeRef.current = timestamp;

    if (gameState.status !== "playing") {
      requestAnimationFrame(gameLoop);
      return;
    }
    
    gameTimeRef.current += deltaTime;
    
    // Update logic runs at a fixed rate (60fps)
    while (gameTimeRef.current >= FRAME_TIME) {
        setGameState(prev => {
            let newLives = prev.lives;
            let newMoney = prev.money;

            // 1. Update enemy positions
            const path = LEVELS[prev.currentLevel - 1].path;
            const updatedEnemies = prev.enemies.map(enemy => {
                if (enemy.pathIndex >= path.length - 1) return enemy;
                
                const targetNode = path[enemy.pathIndex + 1];
                const targetX = targetNode.x * 40 + 20;
                const targetY = targetNode.y * 40 + 20;
                
                const dx = targetX - enemy.x;
                const dy = targetY - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < enemy.speed) {
                    return { ...enemy, pathIndex: enemy.pathIndex + 1 };
                }
                
                const moveX = (dx / distance) * enemy.speed;
                const moveY = (dy / distance) * enemy.speed;
                
                return { ...enemy, x: enemy.x + moveX, y: enemy.y + moveY };
            }).filter(enemy => {
                 if (enemy.pathIndex >= path.length - 1) {
                    newLives--;
                    return false; // Remove enemy
                }
                return true;
            });
            
            // Simplified tower logic: find target and "damage" it
            const updatedTowers = prev.towers.map(tower => {
                if (tower.cooldown > 0) {
                    return { ...tower, cooldown: tower.cooldown - 1 };
                }
                
                const target = updatedEnemies.find(enemy => {
                    const dx = enemy.x - tower.x;
                    const dy = enemy.y - tower.y;
                    return Math.sqrt(dx * dx + dy * dy) <= tower.range;
                });

                if(target) {
                    target.currentHp -= tower.damage;
                    return { ...tower, cooldown: tower.rate };
                }
                
                return tower;
            });

            const survivingEnemies = updatedEnemies.filter(enemy => {
                if(enemy.currentHp <= 0) {
                    newMoney += Math.floor(enemy.baseHp / 10);
                    return false;
                }
                return true;
            });

            // Wave timer logic
            let newWaveTimer = prev.waveTimer;
            if (prev.enemies.length === 0 && prev.status === "playing") {
                if (newWaveTimer > 0) {
                   newWaveTimer = Math.max(0, prev.waveTimer - (FRAME_TIME / 1000));
                }
            }

            return {
                ...prev,
                enemies: survivingEnemies,
                towers: updatedTowers,
                lives: newLives,
                money: newMoney,
                waveTimer: newWaveTimer,
            };
        });
        
        gameTimeRef.current -= FRAME_TIME;
    }
    
    requestAnimationFrame(gameLoop);
  }, [gameState.status, setGameState, gameState.currentLevel]);


  useEffect(() => {
    let waveCountdown: NodeJS.Timeout;
    
    if(gameState.status === 'playing' && gameState.enemies.length === 0) {
        waveCountdown = setInterval(() => {
            setGameState(prev => {
                if (prev.waveTimer <= 1) {
                    // Automatically start next wave
                    handleStartWave();
                    return { ...prev, wave: prev.wave + 1, waveTimer: 30 };
                }
                return { ...prev };
            });
        }, 1000);
    }

    return () => clearInterval(waveCountdown);

  }, [gameState.status, gameState.enemies.length, handleStartWave, setGameState]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameLoop]);
}
