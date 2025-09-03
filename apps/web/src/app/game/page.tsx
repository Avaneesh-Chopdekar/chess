'use client';

import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';

import useSocket from '../../hooks/useSocket';
import Messages from '../../utils/messages';
import ChessBoard from '../../components/chess-board';

export default function GamePage() {
  const socket = useSocket();

  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(board);
      switch (message.type) {
        case Messages.INIT_GAME:
          console.log('init game');
          setBoard(chess?.board());
          break;
        case Messages.MOVE: {
          console.log('move');
          const move = message.payload;
          chess.move(move); // show user toast if invalid
          setBoard(chess.board());
          break;
        }
        case Messages.GAME_OVER:
          console.log('game over');
          break;
        default:
          break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <main className="h-svh flex flex-col items-center justify-center gap-4 sm:gap-8">
      <ChessBoard
        board={board}
        setBoard={setBoard}
        socket={socket}
        chess={chess}
      />
      <div className="flex flex-col gap-4 p-5 border-accent border-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            socket.send(
              JSON.stringify({
                type: Messages.INIT_GAME,
              }),
            );
          }}
        >
          Start
        </button>
      </div>
    </main>
  );
}
