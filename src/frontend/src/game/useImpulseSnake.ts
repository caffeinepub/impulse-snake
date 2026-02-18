import { useRef, useCallback, useEffect, useState } from 'react';

export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'idle' | 'playing' | 'gameOver';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  status: GameStatus;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150; // ms per move

const getRandomPosition = (exclude: Position[] = []): Position => {
  let pos: Position;
  let attempts = 0;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    attempts++;
  } while (
    attempts < 100 &&
    exclude.some(p => p.x === pos.x && p.y === pos.y)
  );
  return pos;
};

const getInitialState = (): GameState => {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  return {
    snake,
    food: getRandomPosition(snake),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    status: 'idle'
  };
};

export function useImpulseSnake() {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const gameStateRef = useRef<GameState>(gameState);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);
  const loopActiveRef = useRef<boolean>(false);

  // Keep ref in sync with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const isOppositeDirection = (dir1: Direction, dir2: Direction): boolean => {
    return (
      (dir1 === 'UP' && dir2 === 'DOWN') ||
      (dir1 === 'DOWN' && dir2 === 'UP') ||
      (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
      (dir1 === 'RIGHT' && dir2 === 'LEFT')
    );
  };

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prev => {
      if (prev.status !== 'playing') return prev;
      // Prevent 180-degree turns
      if (isOppositeDirection(prev.direction, newDirection)) {
        return prev;
      }
      return { ...prev, nextDirection: newDirection };
    });
  }, []);

  const moveSnake = useCallback(() => {
    const state = gameStateRef.current;
    if (state.status !== 'playing') return;

    const head = state.snake[0];
    const direction = state.nextDirection;

    let newHead: Position;
    switch (direction) {
      case 'UP':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'DOWN':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'LEFT':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'RIGHT':
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    // Check wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      setGameState(prev => ({ ...prev, status: 'gameOver' }));
      loopActiveRef.current = false;
      return;
    }

    // Check if food will be eaten
    const willEatFood = newHead.x === state.food.x && newHead.y === state.food.y;

    // Check self collision
    // If not eating food, exclude the tail (last segment) from collision check
    // because it will be removed this tick
    const segmentsToCheck = willEatFood ? state.snake : state.snake.slice(0, -1);
    if (segmentsToCheck.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameState(prev => ({ ...prev, status: 'gameOver' }));
      loopActiveRef.current = false;
      return;
    }

    const newSnake = [newHead, ...state.snake];
    let newFood = state.food;
    let newScore = state.score;

    // Check food collision
    if (willEatFood) {
      newScore += 10;
      newFood = getRandomPosition(newSnake);
    } else {
      newSnake.pop();
    }

    setGameState(prev => ({
      ...prev,
      snake: newSnake,
      food: newFood,
      score: newScore,
      direction
    }));
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    // Guard against stale loops
    if (!loopActiveRef.current || gameStateRef.current.status !== 'playing') {
      return;
    }

    if (timestamp - lastUpdateRef.current >= INITIAL_SPEED) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  const startGame = useCallback(() => {
    // Cancel any existing animation frame
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // Set loop as active
    loopActiveRef.current = true;

    const newState = getInitialState();
    newState.status = 'playing';
    setGameState(newState);
    lastUpdateRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const resetGame = useCallback(() => {
    loopActiveRef.current = false;
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    setGameState(getInitialState());
  }, []);

  useEffect(() => {
    return () => {
      loopActiveRef.current = false;
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    gameState,
    startGame,
    resetGame,
    changeDirection,
    gridSize: GRID_SIZE,
    cellSize: CELL_SIZE
  };
}
