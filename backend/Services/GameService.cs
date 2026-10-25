
using TicTacToe.Api.Models;

namespace TicTacToe.Api.Services;

public class GameService
{
    private readonly Dictionary<Guid, GameSession> _games = new();
    private readonly Scoreboard _scoreboard = new();

    public GameSession CreateGame(string gameMode = "TwoPlayer")
    {
        if (gameMode != "TwoPlayer" && gameMode != "Computer")
        {
            throw new InvalidOperationException(
                "Game mode must be TwoPlayer or Computer.");
        }

        var game = new GameSession
        {
            GameMode = gameMode
        };

        _games[game.Id] = game;

        return game;
    }

    public GameSession? GetGame(Guid id)
    {
        return _games.TryGetValue(id, out var game) ? game : null;
    }

    public GameSession MakeMove(Guid gameId, int row, int column)
    {
        var game = GetGame(gameId)
            ?? throw new InvalidOperationException("Game not found.");

        if (game.Status != "InProgress")
        {
            throw new InvalidOperationException(
                "The game is already completed.");
        }

        if (row < 0 || row > 2 || column < 0 || column > 2)
        {
            throw new InvalidOperationException("Invalid board position.");
        }

        if (game.Board[row][column] is "X" or "O")
        {
            throw new InvalidOperationException(
                "That cell is already occupied.");
        }

        // In computer mode, the human always plays X.
        if (game.GameMode == "Computer" && game.CurrentPlayer != "X")
        {
            throw new InvalidOperationException(
                "Wait for the computer to make its move.");
        }

        PlaceMove(game, row, column);

        // Make the computer's move if the game is still active.
        if (game.Status == "InProgress" &&
            game.GameMode == "Computer")
        {
            var computerMove = FindComputerMove(game);

            if (computerMove != null)
            {
                PlaceMove(
                    game,
                    computerMove.Value.Row,
                    computerMove.Value.Column);
            }
        }

        return game;
    }

    private void PlaceMove(GameSession game, int row, int column)
    {
        var player = game.CurrentPlayer;

        game.Board[row][column] = player;

        game.MoveHistory.Add(new Move
        {
            MoveNumber = game.MoveHistory.Count + 1,
            Player = player,
            Row = row,
            Column = column
        });

        CheckGameStatus(game);

        if (game.Status != "InProgress")
        {
            RecordScore(game);
        }
        else
        {
            game.CurrentPlayer = player == "X" ? "O" : "X";
        }
    }

    private static (int Row, int Column)? FindComputerMove(
        GameSession game)
    {
        // First, try to win.
        var winningMove = FindMoveThatCompletesLine(game, "O");

        if (winningMove != null)
        {
            return winningMove;
        }

        // Next, block the human from winning.
        var blockingMove = FindMoveThatCompletesLine(game, "X");

        if (blockingMove != null)
        {
            return blockingMove;
        }

        // Prefer the center.
        if (IsEmpty(game, 1, 1))
        {
            return (1, 1);
        }

        // Then prefer a corner.
        var corners = new[]
        {
            (Row: 0, Column: 0),
            (Row: 0, Column: 2),
            (Row: 2, Column: 0),
            (Row: 2, Column: 2)
        };

        foreach (var corner in corners)
        {
            if (IsEmpty(game, corner.Row, corner.Column))
            {
                return corner;
            }
        }

        // Finally, use any available cell.
        for (var row = 0; row < 3; row++)
        {
            for (var column = 0; column < 3; column++)
            {
                if (IsEmpty(game, row, column))
                {
                    return (row, column);
                }
            }
        }

        return null;
    }

    private static (int Row, int Column)? FindMoveThatCompletesLine(
        GameSession game,
        string player)
    {
        var lines = new[]
        {
            new[] { 0, 1, 2 },
            new[] { 3, 4, 5 },
            new[] { 6, 7, 8 },
            new[] { 0, 3, 6 },
            new[] { 1, 4, 7 },
            new[] { 2, 5, 8 },
            new[] { 0, 4, 8 },
            new[] { 2, 4, 6 }
        };

        foreach (var line in lines)
        {
            var playerCells = 0;
            var emptyCell = -1;
            var blocked = false;

            foreach (var cell in line)
            {
                var value = game.Board[cell / 3][cell % 3];

                if (value == player)
                {
                    playerCells++;
                }
                else if (value == null)
                {
                    emptyCell = cell;
                }
                else
                {
                    blocked = true;
                    break;
                }
            }

            if (!blocked && playerCells == 2 && emptyCell != -1)
            {
                return (emptyCell / 3, emptyCell % 3);
            }
        }

        return null;
    }

    private static bool IsEmpty(GameSession game, int row, int column)
    {
        return game.Board[row][column] == null;
    }

    private static void CheckGameStatus(GameSession game)
    {
        string? winner = null;
        var winningCells = new List<int>();

        // Check rows.
        for (var row = 0; row < 3; row++)
        {
            if (game.Board[row][0] is "X" or "O" &&
                game.Board[row][0] == game.Board[row][1] &&
                game.Board[row][1] == game.Board[row][2])
            {
                winner = game.Board[row][0];
                winningCells = new List<int>
                {
                    row * 3, row * 3 + 1, row * 3 + 2
                };
                break;
            }
        }

        // Check columns.
        if (winner == null)
        {
            for (var column = 0; column < 3; column++)
            {
                if (game.Board[0][column] is "X" or "O" &&
                    game.Board[0][column] == game.Board[1][column] &&
                    game.Board[1][column] == game.Board[2][column])
                {
                    winner = game.Board[0][column];
                    winningCells = new List<int>
                    {
                        column, column + 3, column + 6
                    };
                    break;
                }
            }
        }

        // Check diagonals.
        if (winner == null)
        {
            var diagonals = new[]
            {
                new[] { 0, 4, 8 },
                new[] { 2, 4, 6 }
            };

            foreach (var cells in diagonals)
            {
                var first = cells[0];
                var middle = cells[1];
                var last = cells[2];

                var firstValue = game.Board[first / 3][first % 3];
                var middleValue = game.Board[middle / 3][middle % 3];
                var lastValue = game.Board[last / 3][last % 3];

                if (firstValue is "X" or "O" &&
                    firstValue == middleValue &&
                    middleValue == lastValue)
                {
                    winner = firstValue;
                    winningCells = cells.ToList();
                    break;
                }
            }
        }

        if (winner != null)
        {
            game.Status = "Won";
            game.Winner = winner;
            game.WinningCells = winningCells;
            return;
        }

        // Check for a draw.
        for (var row = 0; row < 3; row++)
        {
            for (var column = 0; column < 3; column++)
            {
                if (game.Board[row][column] == null)
                {
                    return;
                }
            }
        }

        game.Status = "Draw";
    }

    public GameSession UndoMove(Guid gameId)
    {
        var game = GetGame(gameId)
            ?? throw new InvalidOperationException("Game not found.");

        if (game.MoveHistory.Count == 0)
        {
            throw new InvalidOperationException(
                "There are no moves to undo.");
        }

        // Reverse the score if the completed game is being undone.
        RemoveRecordedScore(game);

        if (game.GameMode == "Computer")
        {
            // Remove the computer's last move, if present.
            if (game.MoveHistory[^1].Player == "O")
            {
                RemoveLastMove(game);
            }

            // Remove the matching human move, if present.
            if (game.MoveHistory.Count > 0 &&
                game.MoveHistory[^1].Player == "X")
            {
                RemoveLastMove(game);
            }

            game.CurrentPlayer = "X";
        }
        else
        {
            RemoveLastMove(game);
        }

        game.Status = "InProgress";
        game.Winner = null;
        game.WinningCells.Clear();
        game.ScoreRecorded = false;

        return game;
    }

    private static void RemoveLastMove(GameSession game)
    {
        var lastMove = game.MoveHistory[^1];

        game.Board[lastMove.Row][lastMove.Column] = null;
        game.MoveHistory.RemoveAt(game.MoveHistory.Count - 1);

        // Update move numbers after removing a move.
        for (var i = 0; i < game.MoveHistory.Count; i++)
        {
            game.MoveHistory[i].MoveNumber = i + 1;
        }

        game.CurrentPlayer = lastMove.Player;
    }

    public GameSession ResetGame(Guid gameId)
    {
        var game = GetGame(gameId)
            ?? throw new InvalidOperationException("Game not found.");

        // Reverse a completed game's score before resetting its state.
        RemoveRecordedScore(game);

        game.Board = new string?[3][]
        {
            new string?[3],
            new string?[3],
            new string?[3]
        };

        game.CurrentPlayer = "X";
        game.Status = "InProgress";
        game.Winner = null;
        game.MoveHistory.Clear();
        game.WinningCells.Clear();
        game.ScoreRecorded = false;

        return game;
    }

    public Scoreboard GetScoreboard()
    {
        return _scoreboard;
    }

    public Scoreboard ResetScoreboard()
    {
        _scoreboard.XWins = 0;
        _scoreboard.OWins = 0;
        _scoreboard.Draws = 0;

        // Existing completed games should not affect the reset scores.
        foreach (var game in _games.Values)
        {
            game.ScoreRecorded = false;
        }

        return _scoreboard;
    }

    private void RecordScore(GameSession game)
    {
        if (game.ScoreRecorded)
        {
            return;
        }

        if (game.Status == "Won" && game.Winner == "X")
        {
            _scoreboard.XWins++;
        }
        else if (game.Status == "Won" && game.Winner == "O")
        {
            _scoreboard.OWins++;
        }
        else if (game.Status == "Draw")
        {
            _scoreboard.Draws++;
        }
        else
        {
            return;
        }

        game.ScoreRecorded = true;
    }

    private void RemoveRecordedScore(GameSession game)
    {
        if (!game.ScoreRecorded)
        {
            return;
        }

        if (game.Status == "Won" && game.Winner == "X")
        {
            _scoreboard.XWins--;
        }
        else if (game.Status == "Won" && game.Winner == "O")
        {
            _scoreboard.OWins--;
        }
        else if (game.Status == "Draw")
        {
            _scoreboard.Draws--;
        }

        game.ScoreRecorded = false;
    }
}
