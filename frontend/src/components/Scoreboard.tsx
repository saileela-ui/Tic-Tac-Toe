
import type { Scoreboard as ScoreboardData } from "../types/game";

interface ScoreboardProps {
  scoreboard: ScoreboardData;
  onResetScoreboard: () => void;
  disabled: boolean;
}

function Scoreboard({
  scoreboard,
  onResetScoreboard,
  disabled,
}: ScoreboardProps) {
  return (
    <section className="scoreboard">
      <h2>Scoreboard</h2>

      <div className="scoreboard-stats">
        <p>X Wins: {scoreboard.xWins}</p>
        <p>O Wins: {scoreboard.oWins}</p>
        <p>Draws: {scoreboard.draws}</p>
      </div>

      <button onClick={onResetScoreboard} disabled={disabled}>
        Reset Scoreboard
      </button>
    </section>
  );
}

export default Scoreboard;
