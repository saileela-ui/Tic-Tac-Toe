
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import GameControls from "./../Components/GameControls";

describe("GameControls UI", () => {
  it("calls onNewGame when New Game is clicked", async () => {
    const user = userEvent.setup();
    const onNewGame = vi.fn();

    render(
      <GameControls
        gameMode="TwoPlayer"
        onGameModeChange={vi.fn()}
        onNewGame={onNewGame}
        onUndo={vi.fn()}
        onReset={vi.fn()}
        disabled={false}
        canUndo={false}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /new game/i })
    );

    expect(onNewGame).toHaveBeenCalledTimes(1);
  });

  
it("calls onUndo when Undo is clicked", async () => {
  const user = userEvent.setup();
  const onUndo = vi.fn();

  render(
    <GameControls
      gameMode="TwoPlayer"
      onGameModeChange={vi.fn()}
      onNewGame={vi.fn()}
      onUndo={onUndo}
      onReset={vi.fn()}
      disabled={false}
      canUndo={true}
    />
  );

  await user.click(
    screen.getByRole("button", { name: /undo/i })
  );

  expect(onUndo).toHaveBeenCalledTimes(1);
});


it("calls onGameModeChange when the game mode is changed", async () => {
  const user = userEvent.setup();
  const onGameModeChange = vi.fn();

  render(
    <GameControls
      gameMode="TwoPlayer"
      onGameModeChange={onGameModeChange}
      onNewGame={vi.fn()}
      onUndo={vi.fn()}
      onReset={vi.fn()}
      disabled={false}
      canUndo={false}
    />
  );

  // Select the Computer game mode.
  await user.selectOptions(
    screen.getByRole("combobox"),
    "Computer"
  );

  expect(onGameModeChange).toHaveBeenCalledWith("Computer");
});

});
