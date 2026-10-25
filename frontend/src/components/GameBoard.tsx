
import type { GameSession } from "../types/game";

interface GameBoardProps {
  game: GameSession;
  onCellClick: (row: number, column: number) => void;
  disabled: boolean;
}

function GameBoard({
  game,
  onCellClick,
  disabled,
}: GameBoardProps) {
  return (
    <div className="game-board">
      {game.board.map((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          const cellIndex = rowIndex * 3 + columnIndex;

          return (
            <button
              key={cellIndex}
              className={`game-cell ${
                game.winningCells.includes(cellIndex)
                  ? "winning-cell"
                  : ""
              }`}
              onClick={() => onCellClick(rowIndex, columnIndex)}
              disabled={
                disabled ||
                cell !== null ||
                game.status !== "InProgress"
              }
            >
              {cell ?? ""}
            </button>
          );
        })
      )}
    </div>
  );
}

export default GameBoard;
