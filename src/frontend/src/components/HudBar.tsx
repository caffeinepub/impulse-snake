import React from 'react';
import { Trophy, User } from 'lucide-react';

interface HudBarProps {
  score: number;
  playerName?: string;
}

export function HudBar({ score, playerName }: HudBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 bg-card border border-border rounded-lg shadow-sm min-h-[56px]">
      <div className="flex items-center gap-2 min-w-0">
        {playerName ? (
          <>
            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">{playerName}</span>
          </>
        ) : (
          <div className="w-4 h-4" aria-hidden="true" />
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Trophy className="w-5 h-5 text-secondary" />
        <span className="text-2xl font-bold text-foreground tabular-nums">{score}</span>
      </div>
    </div>
  );
}
