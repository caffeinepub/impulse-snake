import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export function ControlLegend() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center text-foreground">Controls</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <kbd className="px-3 py-2 bg-muted rounded border border-border font-mono font-semibold">W</kbd>
          <ArrowUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Up</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <kbd className="px-3 py-2 bg-muted rounded border border-border font-mono font-semibold">S</kbd>
          <ArrowDown className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Down</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <kbd className="px-3 py-2 bg-muted rounded border border-border font-mono font-semibold">A</kbd>
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Left</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <kbd className="px-3 py-2 bg-muted rounded border border-border font-mono font-semibold">D</kbd>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Right</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm pt-2 border-t border-border">
        <kbd className="px-4 py-2 bg-primary text-primary-foreground rounded border border-primary font-mono font-semibold animate-pulse-glow">
          SPACE
        </kbd>
        <span className="text-muted-foreground">Start Game</span>
      </div>
    </div>
  );
}
