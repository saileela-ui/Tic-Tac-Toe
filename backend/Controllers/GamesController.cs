
using Microsoft.AspNetCore.Mvc;
using TicTacToe.Api.Models;
using TicTacToe.Api.Services;

namespace TicTacToe.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly GameService _gameService;

    public GameController(GameService gameService)
    {
        _gameService = gameService;
    }

    [HttpPost]
    public ActionResult<GameSession> CreateGame(
        [FromQuery] string gameMode = "TwoPlayer")
    {
        if (gameMode != "TwoPlayer" && gameMode != "Computer")
        {
            return BadRequest("Game mode must be TwoPlayer or Computer.");
        }

        var game = _gameService.CreateGame(gameMode);
        return Ok(game);
    }

    [HttpGet("{id:guid}")]
    public ActionResult<GameSession> GetGame(Guid id)
    {
        var game = _gameService.GetGame(id);

        if (game == null)
        {
            return NotFound("Game not found.");
        }

        return Ok(game);
    }

    [HttpPost("{id:guid}/moves")]
    public ActionResult<GameSession> MakeMove(
        Guid id,
        [FromBody] MoveRequest request)
    {
        try
        {
            var game = _gameService.MakeMove(
                id,
                request.Row,
                request.Column);

            return Ok(game);
        }
        catch (InvalidOperationException ex)
        {
            if (ex.Message == "Game not found.")
            {
                return NotFound(ex.Message);
            }

            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id:guid}/undo")]
    public ActionResult<GameSession> UndoMove(Guid id)
    {
        try
        {
            var game = _gameService.UndoMove(id);
            return Ok(game);
        }
        catch (InvalidOperationException ex)
        {
            if (ex.Message == "Game not found.")
            {
                return NotFound(ex.Message);
            }

            return BadRequest(ex.Message);
        }
    }
    
[HttpPost("{id:guid}/reset")]
public ActionResult<GameSession> ResetGame(Guid id)
{
    try
    {
        var game = _gameService.ResetGame(id);
        return Ok(game);
    }
    catch (InvalidOperationException ex)
    {
        if (ex.Message == "Game not found.")
        {
            return NotFound(ex.Message);
        }

        return BadRequest(ex.Message);
    }
}


[HttpGet("scoreboard")]
public ActionResult<Scoreboard> GetScoreboard()
{
    return Ok(_gameService.GetScoreboard());
}

[HttpPost("scoreboard/reset")]
public ActionResult<Scoreboard> ResetScoreboard()
{
    return Ok(_gameService.ResetScoreboard());
}


}

public class MoveRequest
{
    public int Row { get; set; }

    public int Column { get; set; }
}
