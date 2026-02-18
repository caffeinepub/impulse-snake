import React, { useEffect, useState, useCallback } from 'react';
import { useImpulseSnake } from '../game/useImpulseSnake';
import { SnakeCanvas } from '../game/SnakeCanvas';
import { ControlLegend } from '../components/ControlLegend';
import { HudBar } from '../components/HudBar';
import { SiX, SiGithub } from 'react-icons/si';
import { isTextEditingElement } from '../utils/isTextEditingElement';

export default function SnakeGamePage() {
  const { gameState, startGame, resetGame, changeDirection, gridSize, cellSize } = useImpulseSnake();
  const [playerName, setPlayerName] = useState('');
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check both event target and active element for text editing context
      const target = e.target as Element;
      if (isTextEditingElement(target) || isTextEditingElement(document.activeElement)) {
        // Allow all normal typing behavior in text fields
        return;
      }

      // Prevent default for game keys only when not in a text field
      if (['w', 'a', 's', 'd', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        // Guard against multiple starts
        if (isStarting) return;
        
        if (gameState.status === 'idle' || gameState.status === 'gameOver') {
          setIsStarting(true);
          if (showStartScreen) {
            setShowStartScreen(false);
          }
          startGame();
          // Reset starting flag after a short delay
          setTimeout(() => setIsStarting(false), 200);
        }
        return;
      }

      if (gameState.status === 'playing') {
        switch (e.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            changeDirection('UP');
            break;
          case 's':
          case 'arrowdown':
            changeDirection('DOWN');
            break;
          case 'a':
          case 'arrowleft':
            changeDirection('LEFT');
            break;
          case 'd':
          case 'arrowright':
            changeDirection('RIGHT');
            break;
        }
      }
    },
    [gameState.status, showStartScreen, startGame, changeDirection, isStarting]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handler to stop propagation from the input field
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Stop all key events from bubbling up to the window handler
    e.stopPropagation();
  }, []);

  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'impulse-snake'
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Impulse Snake</h1>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <SiX className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        {/* Start Screen - Constrained width for readability */}
        {showStartScreen && gameState.status === 'idle' && (
          <div className="container mx-auto px-4 py-8">
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-8 shadow-lg space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-primary">Welcome to Impulse Snake!</h2>
                  <p className="text-muted-foreground">
                    Guide your snake, eat the food, and grow as long as you can.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="playerName" className="block text-sm font-medium text-foreground mb-2">
                      Player Name (optional)
                    </label>
                    <input
                      id="playerName"
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      maxLength={20}
                    />
                  </div>

                  <ControlLegend />

                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground animate-pulse-glow">
                      Press <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded font-mono text-xs font-semibold">SPACE</kbd> to begin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Area - Full screen with grid background */}
        {!showStartScreen && (
          <div className="w-full h-full flex flex-col">
            {/* Gameplay Surface with Grid Background */}
            <div className="flex-1 game-grid-bg flex flex-col">
              {/* HUD - Fixed at top in normal flow */}
              {gameState.status === 'playing' && (
                <div className="game-hud-container">
                  <div className="container mx-auto max-w-2xl px-4">
                    <HudBar score={gameState.score} playerName={playerName || undefined} />
                  </div>
                </div>
              )}

              {/* Playfield - Centered in remaining space */}
              <div className="flex-1 flex items-center justify-center p-4 relative">
                <div className="game-playfield-container">
                  <SnakeCanvas gameState={gameState} gridSize={gridSize} cellSize={cellSize} />
                </div>

                {/* Game Over Overlay - Centered on playfield */}
                {gameState.status === 'gameOver' && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                    <div className="w-full max-w-md pointer-events-auto">
                      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-8 shadow-lg space-y-6">
                        <div className="text-center space-y-2">
                          <h2 className="text-3xl font-bold text-destructive">Game Over!</h2>
                          {playerName && (
                            <p className="text-lg text-muted-foreground">
                              Nice try, <span className="text-foreground font-semibold">{playerName}</span>!
                            </p>
                          )}
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Final Score</p>
                          <p className="text-5xl font-bold text-primary tabular-nums">{gameState.score}</p>
                        </div>

                        <div className="text-center pt-4">
                          <p className="text-sm text-muted-foreground animate-pulse-glow">
                            Press <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded font-mono text-xs font-semibold">SPACE</kbd> to play again
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Impulse Snake. All rights reserved.</p>
            <p>
              Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
