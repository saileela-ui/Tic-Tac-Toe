
import type { GameMode } from "../types/game";

interface GameControlsProps {
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  onNewGame: () => void;
  onUndo: () => void;
  onReset: () => void;
  disabled: boolean;
  canUndo: boolean;
}

function GameControls({
  gameMode,
  onGameModeChange,
  onNewGame,
  onUndo,
  onReset,
  disabled,
  canUndo,
}: GameControlsProps) {
  return (
    <div className="game-controls">
      <label htmlFor="game-mode">Game mode: </label>

      <select
        id="game-mode"
        value={gameMode}
        onChange={(event) =>
          onGameModeChange(event.target.value as GameMode)
        }
        disabled={disabled}
      >
        <option value="TwoPlayer">Two Players</option>
        <option value="Computer">Play Against Computer</option>
      </select>

      <div className="control-buttons">
        <button onClick={onNewGame} disabled={disabled}>
          New Game
        </button>

        <button onClick={onUndo} disabled={disabled || !canUndo}>
          Undo
        </button>

        <button onClick={onReset} disabled={disabled}>
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default GameControls;
