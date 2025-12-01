"use client";

import { Button } from "@/components/ui/button";
import type { GameState } from "@/lib/types";
import { FolderDown, Pause, Play, Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameControlsProps {
  onPause: () => void;
  onSave: () => void;
  onLoad: () => void;
  gameState: GameState;
}

export default function GameControls({
  onPause,
  onSave,
  onLoad,
  gameState,
}: GameControlsProps) {
  return (
    <TooltipProvider>
      <div
        className="flex justify-center gap-2 p-2 rounded-lg"
        style={{ backgroundColor: "#2a2a2a", border: "2px solid #444" }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onPause} variant="accent" size="icon">
              {gameState.status === "paused" ? <Play /> : <Pause />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{gameState.status === "paused" ? "Resume" : "Pause"} Game</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onSave} variant="outline" size="icon">
              <Save />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save Game</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onLoad} variant="outline" size="icon">
              <FolderDown />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Load Game</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
