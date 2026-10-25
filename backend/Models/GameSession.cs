
namespace TicTacToe.Api.Models;

public class GameSession
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string?[][] Board { get; set; } =
    {
        new string?[3],
        new string?[3],
        new string?[3]
    };

    public string CurrentPlayer { get; set; } = "X";

    public string GameMode { get; set; } = "TwoPlayer";

    public string Status { get; set; } = "InProgress";

    public string? Winner { get; set; }
    
    public bool ScoreRecorded { get; set; }

    public List<Move> MoveHistory { get; set; } = new();

    public List<int> WinningCells { get; set; } = new();
}
