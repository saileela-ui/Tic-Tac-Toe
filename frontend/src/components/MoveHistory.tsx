
import type { Move } from "../types/game";

interface MoveHistoryProps {
  moves: Move[];
}

function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <section className="move-history">
      <h2>Move History</h2>

      {moves.length === 0 ? (
        <p>No moves yet.</p>
      ) : (
        <ol>
          {moves.map((move) => (
            <li key={move.moveNumber}>
              Move {move.moveNumber}: {move.player} — Row{" "}
              {move.row + 1}, Column {move.column + 1}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default MoveHistory;
