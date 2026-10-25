
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MoveHistory from "./../Components/MoveHistory";
import type { Move } from "../types/game";

const mockMoves: Move[] = [
  { moveNumber: 1, player: "X", row: 0, column: 0 },
  { moveNumber: 2, player: "O", row: 1, column: 1 },
];

describe("MoveHistory UI", () => {
  it("displays all moves in the history", () => {
    render(<MoveHistory moves={mockMoves} />);

    expect(screen.getByText("Move History")).toBeInTheDocument();
    expect(
      screen.getByText(/Move 1: X.*Row 1, Column 1/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Move 2: O.*Row 2, Column 2/)
    ).toBeInTheDocument();
  });

  it("displays a message when there are no moves", () => {
    render(<MoveHistory moves={[]} />);

    expect(screen.getByText("No moves yet.")).toBeInTheDocument();
  });
});
