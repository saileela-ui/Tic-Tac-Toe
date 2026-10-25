
import { useState , useEffect } from "react";
import { gameApi } from "./services/gameService";
import type { GameMode, GameSession } from "./types/game";
import GameBoard from "./Components/GameBoard";
import GameControls from "./Components/GameControls";
import MoveHistory from "./Components/MoveHistory";
import Scoreboard from "./Components/Scoreboard";
import type { Scoreboard as ScoreboardData } from "./types/game";
import "./App.css";

function App() {
  const [game, setGame] = useState<GameSession | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("TwoPlayer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scoreboard, setScoreboard] = useState<ScoreboardData>({
  xWins: 0,
  oWins: 0,
  draws: 0,
});


async function runAction(action: () => Promise<GameSession>) {
  try {
    setLoading(true);
    setError("");

    const updatedGame = await action();
    setGame(updatedGame);

    await loadScoreboard();
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}

  function startNewGame() {
    return runAction(() => gameApi.createGame(gameMode));
  }

  function undoMove() {
    if (!game) return;
    return runAction(() => gameApi.undoMove(game.id));
  }

  function resetGame() {
    if (!game) return;
    return runAction(() => gameApi.resetGame(game.id));
  }

  function playMove(row: number, column: number) {
    if (!game) return;
    return runAction(() => gameApi.makeMove(game.id, row, column));
  }

    async function loadScoreboard() {
      try {
        setScoreboard(await gameApi.getScoreboard());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load scoreboard."
        );
      }
    }

    async function resetScoreboard() {
      try {
        setLoading(true);
        setError("");
        setScoreboard(await gameApi.resetScoreboard());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not reset scoreboard."
        );
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      void loadScoreboard();
    }, []);


  return (
    <main className="app">
      <h1>Tic Tac Toe</h1>

      <GameControls
        gameMode={gameMode}
        onGameModeChange={setGameMode}
        onNewGame={startNewGame}
        onUndo={undoMove}
        onReset={resetGame}
        disabled={loading}
        canUndo={!!game && game.moveHistory.length > 0}
      />

      {error && <p className="error-message">{error}</p>}

      {!game ? (
        <button onClick={startNewGame} disabled={loading}>
          Start New Game
        </button>
      ) : (
        <>
          <p className="game-status">
            {game.status === "Won"
              ? `Player ${game.winner} wins!`
              : game.status === "Draw"
                ? "It's a draw!"
                : `Current player: ${game.currentPlayer}`}
          </p>

          <GameBoard
            game={game}
            onCellClick={playMove}
            disabled={loading || game.status !== "InProgress"}
          />

          <MoveHistory moves={game.moveHistory} />

          <Scoreboard
            scoreboard={scoreboard}
            onResetScoreboard={resetScoreboard}
            disabled={loading}
          />

          <p>Moves played: {game.moveHistory.length}</p>
        </>
      )}
    </main>
  );
}

export default App;
