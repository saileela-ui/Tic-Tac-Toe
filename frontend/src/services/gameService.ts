
import type {
  GameMode,
  GameSession,
  Scoreboard,
} from "../types/game";

const API_URL = "http://localhost:5239/api/Game";

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const gameApi = {
  createGame(gameMode: GameMode): Promise<GameSession> {
    return request<GameSession>(
      `${API_URL}?gameMode=${gameMode}`,
      { method: "POST" }
    );
  },

  getGame(id: string): Promise<GameSession> {
    return request<GameSession>(`${API_URL}/${id}`);
  },

  makeMove(
    id: string,
    row: number,
    column: number
  ): Promise<GameSession> {
    return request<GameSession>(`${API_URL}/${id}/moves`, {
      method: "POST",
      body: JSON.stringify({ row, column }),
    });
  },

  undoMove(id: string): Promise<GameSession> {
    return request<GameSession>(`${API_URL}/${id}/undo`, {
      method: "POST",
    });
  },

  resetGame(id: string): Promise<GameSession> {
    return request<GameSession>(`${API_URL}/${id}/reset`, {
      method: "POST",
    });
  },

  getScoreboard(): Promise<Scoreboard> {
    return request<Scoreboard>(`${API_URL}/scoreboard`);
  },

  resetScoreboard(): Promise<Scoreboard> {
    return request<Scoreboard>(
      `${API_URL}/scoreboard/reset`,
      { method: "POST" }
    );
  },
};
