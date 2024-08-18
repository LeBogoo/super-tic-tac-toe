import "./css/main.css";
import "./css/game.css";
import "./css/screen.css";
import "./css/home.css";
import "./css/waiting.css";
import "./css/modal.css";

import { Connection } from "./connection";
import { FindGamePacket } from "./packets/outgoing/find-game-packet";
import { WaitingForGamePacket } from "./packets/incoming/waiting-for-game-packet";
import { StopSearchPacket } from "./packets/outgoing/stop-search-packet";
import { GameStoppedPacket } from "./packets/incoming/game-stopped-packet";
import { CreateGamePacket } from "./packets/outgoing/create-game-packet";
import { GameCreatedPacket } from "./packets/incoming/game-created-packet";
import { DisconnectedEvent } from "./packets/incoming/disconnected-event";
import { JoinGamePacket } from "./packets/outgoing/join-game-packet";
import { SuperBoard } from "./super-board";
import { Cell } from "./cell";
import { SetCellPacket } from "./packets/outgoing/set-cell-packet";
import { GameStartedPacket } from "./packets/incoming/game-started";
import { BoardUpdatePacket } from "./packets/incoming/board-update-packet";
import { PlayerTurnPacket } from "./packets/incoming/player-turn-packet";
import { GameJoinedPacket } from "./packets/incoming/game-joined";
import { TTTSymbol } from "./ttt-symbol";
import { EmojisPacket } from "./packets/incoming/emojis-packet";
import { ErrorPacket } from "./packets/incoming/error-packet";
import { WinEndPacket } from "./packets/incoming/win-end-packet";
import { ResetGamePacket } from "./packets/bidirectional/reset-game-packet";

const findGameButton = document.getElementById("find-random-game-button")!;
const createGameButton = document.getElementById("create-game-button")!;
const joinGameButton = document.getElementById("join-game-button")!;
const cancleWaitButton = document.getElementById("cancle-wait-button")!;
const gameCodeHeading = document.getElementById("game-code-heading")!;
const gameCodeText = document.getElementById("game-code-text")!;
const currentPlayerText = document.getElementById("current-player-text")!;
const gameCodeInput = document.getElementById(
  "game-code-input"
)! as HTMLInputElement;
const superBoardDiv = document.getElementById("super-board") as HTMLDivElement;
const endModal = document.getElementById("end")!;
const endText = document.getElementById("end-text")!;
const restartButton = document.getElementById("restart-button")!;

export class App {
  public connection = new Connection("ws://localhost:8080");
  private selectedEmoji!: string;
  private emojiMap = { x: "", o: "" };
  private currentPlayer: TTTSymbol = "x";
  private ownSymbol: TTTSymbol = "x";

  constructor() {
    if (location.hostname !== "localhost") {
      this.connection.setServerURL(`wss://${location.hostname}`);
    }

    this.connection.connect();

    setTimeout(() => {
      this.showScreen("home");
    }, 1);

    findGameButton.addEventListener("click", () => {
      this.connection.send(new FindGamePacket(this.selectedEmoji));
      gameCodeHeading.style.display = "none";
    });

    cancleWaitButton.addEventListener("click", () => {
      this.connection.send(new StopSearchPacket());
    });

    createGameButton.addEventListener("click", () => {
      this.connection.send(new CreateGamePacket(this.selectedEmoji));
    });

    joinGameButton.addEventListener("click", () => {
      const gameCode = gameCodeInput.value;
      if (gameCode) {
        this.connection.send(new JoinGamePacket(gameCode, this.selectedEmoji));
      }

      gameCodeInput.value = "";
    });

    restartButton.addEventListener("click", () => {
      this.connection.send(new ResetGamePacket());
    });

    this.connection.on<EmojisPacket>("emojis", (packet) => {
      this.selectEmoji(
        localStorage.getItem("selectedEmoji") ||
          packet.emojis[Math.floor(Math.random() * packet.emojis.length)],
        false
      );

      // check if query param of emoji is set
      const urlParams = new URLSearchParams(window.location.search);
      const emoji = urlParams.get("emoji");
      if (emoji) {
        this.selectEmoji(emoji);
      }

      localStorage.setItem("selectedEmoji", this.selectedEmoji);

      this.populateEmojis(packet.emojis);
    });

    this.connection.on<ErrorPacket>("error", (packet) => {
      alert(packet.errorMessage);
    });

    this.connection.on<GameCreatedPacket>("game_created", (packet) => {
      console.log("Game created. Waiting for other player to join");
      gameCodeHeading.style.display = "block";
      gameCodeText.innerText = packet.gameCode;
      this.showScreen("waiting");
    });

    this.connection.on<GameJoinedPacket>("game_joined", (packet) => {
      console.log("Game joined. Updating own symbol");
      this.ownSymbol = packet.playerSymbol;
    });

    this.connection.on<WaitingForGamePacket>("waiting_for_game", () => {
      console.log("Waiting for game");
      this.showScreen("waiting");
    });

    this.connection.on<GameStartedPacket>("game_started", (packet) => {
      console.log("Game started");

      this.emojiMap.x = packet.xEmoji;
      this.emojiMap.o = packet.oEmoji;

      // set the css --x-symbol and --o-symbol variables
      document.documentElement.style.setProperty(
        "--x-symbol",
        `"${this.emojiMap.x}"`
      );
      document.documentElement.style.setProperty(
        "--o-symbol",
        `"${this.emojiMap.o}"`
      );

      this.showScreen("game");
    });

    this.connection.on<ResetGamePacket>("reset_game", () => {
      endModal.classList.remove("shown");
    });

    this.connection.on<PlayerTurnPacket>("player_turn", (packet) => {
      this.currentPlayer = packet.cell;
      let currentPlayerEmoji = this.emojiMap[this.currentPlayer];
      currentPlayerText.innerText = currentPlayerEmoji;
    });

    this.connection.on<BoardUpdatePacket>("board_update", (packet) => {
      this.renderBoard(packet.board);
    });

    this.connection.on<WinEndPacket>("win_end", (packet) => {
      let winnerEmoji = this.emojiMap[packet.winner];
      endText.innerText = `Winner: ${winnerEmoji}`;
      endModal.classList.add("shown");
    });

    this.connection.on<WinEndPacket>("draw_end", () => {
      console.log("Game ended");
      endText.innerText = "It's a draw!";
      endModal.classList.add("shown");
    });

    this.connection.on<GameStoppedPacket>("game_stopped", () => {
      console.log("Game stopped");
      this.showScreen("home");
    });

    this.connection.on<DisconnectedEvent>("disconnected", () => {
      console.log("Disconnected from server");
      this.showScreen("home");
    });
  }

  selectEmoji(emoji: string, save = true) {
    this.selectedEmoji = emoji;
    if (save) localStorage.setItem("selectedEmoji", emoji);
    const selectedEmojiSpan = document.getElementById("selectedEmoji")!;
    selectedEmojiSpan.textContent = this.selectedEmoji;

    document.title = `Super TTT - ${this.selectedEmoji}`;
  }

  populateEmojis(emojis: string[] = []) {
    const emojiContainer = document.getElementById("emojiContainer")!;

    emojis.forEach((emoji) => {
      const span = document.createElement("span");
      span.classList.add("emoji");
      span.textContent = emoji;
      span.dataset.emoji = emoji;
      emojiContainer.appendChild(span);

      if (emoji == this.selectedEmoji) {
        span.classList.add("selected");
      }

      span.addEventListener("click", () => {
        document
          .querySelectorAll(".emoji")
          .forEach((e) => e.classList.remove("selected"));
        span.classList.add("selected");
        this.selectEmoji(emoji);
      });
    });
  }

  showScreen(id: string) {
    endModal.classList.remove("shown");

    const screens = document.querySelectorAll(".screen");
    screens.forEach((screen) => {
      if (screen.id == id) {
        screen.classList.add("active");
      } else {
        screen.classList.remove("active");
      }
    });
  }

  renderBoard(board: {
    superCells: {
      cells: string[];
      active: boolean;
    }[];
  }) {
    const superBoard = SuperBoard.fromJson(board);
    const boardSize = superBoard.boardSize;
    superBoardDiv.innerHTML = "";

    for (let x1 = 0; x1 < boardSize; x1++) {
      for (let y1 = 0; y1 < boardSize; y1++) {
        let superCellElement = document.createElement("div");

        const superCell = superBoard.getSuperCell(x1, y1);
        if (superCell.isDone()) {
          superCellElement.classList.add(
            "cell",
            "finish-cell",
            "disabled",
            superCell.getWinner() || "T"
          );
        } else {
          superCellElement.classList.add("super-cell");
          if (superCell.isActive()) {
            superCellElement.classList.add("active");
          }

          for (let x2 = 0; x2 < boardSize; x2++) {
            for (let y2 = 0; y2 < boardSize; y2++) {
              let cellElement = document.createElement("button");
              cellElement.classList.add("cell", "grid-cell");

              const cell = superCell.getCell(x2, y2);

              if (cell !== Cell.Empty) {
                cellElement.classList.add("disabled", cell);
              }

              if (
                superCell.isActive() &&
                this.ownSymbol == this.currentPlayer
              ) {
                cellElement.addEventListener("click", () => {
                  if (superCell.isActive() && cell === Cell.Empty) {
                    this.connection.send(new SetCellPacket(x1, y1, x2, y2));
                  }
                });
              } else {
                cellElement.classList.add("disabled");
              }

              superCellElement.appendChild(cellElement);
            }
          }
        }

        superBoardDiv.appendChild(superCellElement);
      }
    }
  }
}

new App();
