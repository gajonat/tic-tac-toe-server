export type Grid = number[][];

export interface Game {
  _id: string;
  player1: string;
  player2: string;
  gridSize: number;
  gameLevel: number;
  turn: number;
  grid: Grid;
  isFinished: boolean;
  winner: number;
  player1Score: number;
  player2Score: number;
}
