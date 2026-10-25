
export type Player = "X" | "O";

export type GameMode = "TwoPlayer" | "Computer";

export type GameStatus = "InProgress" | "Won" | "Draw";

export interface Move {
  moveNumber: number;
  player: Player;
  row: number;
  column: number;
}

export interface GameSession {
  id: string;
  board: (Player | null)[][];
  currentPlayer: Player;
  gameMode: GameMode;
  status: GameStatus;
  winner: Player | null;
  moveHistory: Move[];
  winningCells: number[];
}

export interface Scoreboard {
  xWins: number;
  oWins: number;
  draws: number;
}
