
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GameBoard from "./../Components/GameBoard";
import type { GameSession } from "../types/game";
import userEvent from "@testing-library/user-event";

const mockGame: GameSession = {
  id: "test-game",
  board: [
    ["X", null, null],
    [null, "O", null],
    [null, null, "X"],
  ],
  currentPlayer: "O",
  gameMode: "TwoPlayer",
  status: "InProgress",
  winner: null,
  moveHistory: [],
  winningCells: [],
};

describe("GameBoard UI", () => {
  it("renders the game board with 9 cells", () => {
    render(
      <GameBoard
        game={mockGame}
        onCellClick={vi.fn()}
        disabled={false}
      />
    );

    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("displays the existing X and O moves", () => {
    render(
      <GameBoard
        game={mockGame}
        onCellClick={vi.fn()}
        disabled={false}
      />
    );

    expect(screen.getAllByText("X")).toHaveLength(2);
    expect(screen.getAllByText("O")).toHaveLength(1);
  });

  
it("calls onCellClick when an empty cell is clicked", async () => {
  const user = userEvent.setup();
  const onCellClick = vi.fn();

  render(
    <GameBoard
      game={mockGame}
      onCellClick={onCellClick}
      disabled={false}
    />
  );

  const cells = screen.getAllByRole("button");
  await user.click(cells[1]);

  expect(onCellClick).toHaveBeenCalledTimes(1);
  expect(onCellClick).toHaveBeenCalledWith(0, 1);
});

});
