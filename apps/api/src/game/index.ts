import { WebSocket } from "ws";
import { Chess } from "chess.js";
import Messages from "../utils/messages";

class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private moveCount: number;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.moveCount = 0;

    this.player1.send(
      JSON.stringify({
        type: Messages.INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: Messages.INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    if (this.moveCount % 2 === 0 && socket !== this.player1) return;
    if (this.moveCount % 2 === 1 && socket !== this.player2) return;

    try {
      this.board.move(move);
    } catch (error) {
      console.log(error);
      return;
    }

    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: Messages.GAME_OVER,
          payload: { winner: this.board.turn() === "w" ? "white" : "black" },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: Messages.GAME_OVER,
          payload: { winner: this.board.turn() === "w" ? "white" : "black" },
        })
      );

      return;
    }

    if (this.board.moves().length % 2 === 1) {
      this.player1.send(
        JSON.stringify({
          type: Messages.MOVE,
          payload: move,
        })
      );
    } else {
      this.player2.send(
        JSON.stringify({
          type: Messages.MOVE,
          payload: move,
        })
      );
    }

    this.moveCount++;
  }
}

export default Game;
