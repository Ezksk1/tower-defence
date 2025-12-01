"use client";

import type { GameState } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getArsenalSuggestion } from "@/ai/flows/arsenal-advisor";
import { TOWERS, ENEMIES_BY_WAVE } from "@/lib/game-config";
import { Loader2 } from "lucide-react";

export default function ArsenalAdvisor({ gameState }: { gameState: GameState }) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setIsOpen(true);
    setRecommendation("");

    try {
      const upcomingEnemyIds = ENEMIES_BY_WAVE[gameState.wave] || [];
      const enemyTypes = upcomingEnemyIds.map(id => id.toString());

      const input = {
        waveNumber: gameState.wave,
        enemyTypes: enemyTypes,
        availableTowers: Object.values(TOWERS).map((t) => t.name),
      };

      const result = await getArsenalSuggestion(input);

      if (!result || !result.recommendedTowers || result.recommendedTowers.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not get a recommendation from the AI.",
        });
        setIsOpen(false);
      } else {
        setRecommendation(result.recommendedTowers.join("\n\n"));
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while getting advice.",
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleGetAdvice}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span className="mr-2">🤖</span>
        )}
        {isLoading ? "Thinking..." : "Get AI Arsenal Advice"}
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">
              Arsenal Suggestion for Wave {gameState.wave}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="pt-4">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-foreground">
                    {recommendation}
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
