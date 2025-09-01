import { useState } from "react";
import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import Messages from "../utils/messages";

export default function ChessBoard({
  board,
  setBoard,
  socket,
  chess,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  setBoard: (
    board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
  ) => void;
  socket: WebSocket;
  chess: Chess;
}) {
  const [from, setFrom] = useState<Square | null>(null);
  // const [to, setTo] = useState<Square | null>(null);

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                "" +
                (8 - i)) as Square;

              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation);
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: Messages.MOVE,
                          payload: {
                            move: {
                              from,
                              to: squareRepresentation,
                            },
                          },
                        })
                      );

                      setFrom(null);
                      chess.move({
                        from,
                        to: squareRepresentation,
                      });
                      setBoard(chess.board());
                      console.log({
                        from,
                        to: squareRepresentation,
                      });
                    }
                  }}
                  key={j}
                  className={`w-12 h-12 ${(i + j) % 2 === 0 ? "bg-blue-400" : "bg-slate-300"}`}
                >
                  <div className="w-full justify-center flex h-full">
                    <div className="h-full justify-center flex flex-col">
                      {square ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="w-8 h-8"
                          src={`/pieces/${square?.type}-${square?.color}.svg`}
                          alt={`${square?.type}-${square?.color}`}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
