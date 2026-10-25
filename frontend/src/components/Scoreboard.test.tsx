
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Scoreboard from "./../Components/Scoreboard";
import type { Scoreboard as ScoreboardData } from "../types/game";

const mockScoreboard: ScoreboardData = {
  xWins: 2,
  oWins: 3,
  draws: 1,
};

describe("Scoreboard UI", () => {
  it("displays X wins, O wins, and draws", () => {
    render(
      <Scoreboard
        scoreboard={mockScoreboard}
        onResetScoreboard={vi.fn()}
        disabled={false}
      />
    );

    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it("calls onResetScoreboard when reset is clicked", async () => {
    const user = userEvent.setup();
    const onResetScoreboard = vi.fn();

    render(
      <Scoreboard
        scoreboard={mockScoreboard}
        onResetScoreboard={onResetScoreboard}
        disabled={false}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /reset scoreboard/i })
    );

    expect(onResetScoreboard).toHaveBeenCalledTimes(1);
  });
});
