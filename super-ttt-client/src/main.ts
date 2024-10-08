import "./css/main.css";
import "./css/game.css";
import "./css/screen.css";
import "./css/home.css";
import "./css/waiting.css";
import "./css/modal.css";
import "./css/alert.css";

import { Connection } from "./connection";
import { FindGamePacket } from "./packets/outgoing/find-game-packet";
import { WaitingForGamePacket } from "./packets/incoming/waiting-for-game-packet";
import { StopSearchPacket } from "./packets/outgoing/stop-search-packet";
import { GameStoppedPacket } from "./packets/incoming/game-stopped-packet";
import { CreateGamePacket } from "./packets/outgoing/create-game-packet";
import { GameCreatedPacket } from "./packets/incoming/game-created-packet";
import { DisconnectedEvent } from "./packets/events/disconnected-event";
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
import { ConnectionInformationEvent } from "./packets/events/connection-information-event";
import { GGPacket } from "./packets/bidirectional/gg-packet";

const findGameButton = document.getElementById("find-random-game-button")!;
const createGameButton = document.getElementById("create-game-button")!;
const joinGameButton = document.getElementById("join-game-button")!;
const cancelWaitButton = document.getElementById("cancel-wait-button")!;
const copyGameUrlButton = document.getElementById("copy-game-url-button")!;
const gameCodeHeading = document.getElementById("game-code-heading")!;
const gameCodeText = document.getElementById("game-code-text")!;
const currentPlayerText = document.getElementById("current-player-text")!;
const gameCodeInput = document.getElementById(
  "game-code-input"
)! as HTMLInputElement;
const superBoardDiv = document.getElementById("super-board") as HTMLDivElement;
const alertBox = document.getElementById("alert-box") as HTMLDivElement;
const endModal = document.getElementById("end")!;
const endText = document.getElementById("end-text")!;
const errorModal = document.getElementById("error")!;
const errorText = document.getElementById("error-text")!;
const dismissErrorButton = document.getElementById("dismiss-error-button")!;
const restartButton = document.getElementById("restart-button")!;
const ggButton = document.getElementById("gg-button")!;
const joinGameWithEmojiButton = document.getElementById(
  "join-game-with-emoji-button"
)!;

export class App {
  public connection = new Connection("ws://localhost:8080");
  private selectedEmoji!: string;
  private emojiMap = { x: "", o: "" };
  private currentPlayer: TTTSymbol = "x";
  private ownSymbol: TTTSymbol = "x";
  private errorCallback?: () => void;

  constructor() {
    if (location.hostname !== "localhost") {
      this.connection.setServerURL(`wss://${location.hostname}`);
    }

    this.connection.connect();

    setTimeout(() => {
      if (location.hash) {
        this.showScreen("emoji-selection");
        return;
      }

      this.showScreen("home");
    }, 1);

    findGameButton.addEventListener("click", () => {
      this.connection.send(new FindGamePacket(this.selectedEmoji));
      gameCodeHeading.classList.add("hidden");
      copyGameUrlButton.classList.add("hidden");
    });

    cancelWaitButton.addEventListener("click", () => {
      this.connection.send(new StopSearchPacket());
    });

    copyGameUrlButton.addEventListener("click", () => {
      const gameUrl = `${location.origin}/#${gameCodeText.innerText}`;
      navigator.clipboard.writeText(gameUrl);
      this.showAlert("Game URL copied to clipboard");
    });

    createGameButton.addEventListener("click", () => {
      gameCodeHeading.classList.remove("hidden");
      copyGameUrlButton.classList.remove("hidden");
      console.log(gameCodeHeading, copyGameUrlButton);

      this.connection.send(new CreateGamePacket(this.selectedEmoji));
    });

    joinGameButton.addEventListener("click", () => {
      const gameCode = gameCodeInput.value;
      if (gameCode) {
        this.connection.send(new JoinGamePacket(gameCode, this.selectedEmoji));
      } else {
        this.showAlert("Please enter a game code");
      }

      gameCodeInput.value = "";
    });

    joinGameWithEmojiButton.addEventListener("click", () => {
      const gameCode = location.hash.slice(1);
      if (gameCode) {
        this.connection.send(new JoinGamePacket(gameCode, this.selectedEmoji));
      } else {
        this.showError("No game code found in URL", () => {
          this.showScreen("home");
        });
      }

      gameCodeInput.value = "";
    });

    dismissErrorButton.addEventListener("click", () => {
      errorModal.classList.remove("shown");
      if (this.errorCallback) this.errorCallback();
      this.errorCallback = undefined;
    });

    restartButton.addEventListener("click", () => {
      this.connection.send(new ResetGamePacket());
    });

    ggButton.addEventListener("click", () => {
      this.connection.send(new GGPacket(this.ownSymbol));
    });

    this.connection.on<GGPacket>("gg", (packet) => {
      let ggEmoji = this.emojiMap[packet.player];
      let ggText = `${ggEmoji}: GG!`;
      this.showAlert(ggText, 1000);
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

      const selectedEmojis = document.querySelectorAll(".selected");
      console.log(selectedEmojis);

      if (selectedEmojis.length > 0) {
        for (let selectedEmoji of selectedEmojis) {
          selectedEmoji.scrollIntoView({
            block: "center",
          });
        }
      }
    });

    this.connection.on<ErrorPacket>("error", (packet) => {
      this.showError(packet.errorMessage);
    });

    this.connection.on<ConnectionInformationEvent>(
      "connection_information",
      (packet) => {
        this.showAlert(packet.message);
      }
    );

    this.connection.on<GameCreatedPacket>("game_created", (packet) => {
      console.log("Game created. Waiting for other player to join");
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

  showError(message: string, callback?: () => void) {
    errorText.innerText = message;
    errorModal.classList.add("shown");
    this.errorCallback = callback;
  }

  showAlert(message: string, duration = 3000) {
    const alert = document.createElement("span");
    alert.classList.add("alert");
    alert.innerText = message;
    alertBox.appendChild(alert);
    setTimeout(() => {
      alert.classList.add("shown");
    }, 100);

    setTimeout(() => {
      alert.classList.remove("shown");
      setTimeout(() => {
        alertBox.removeChild(alert);
      }, 1000);
    }, duration);
  }

  selectEmoji(emoji: string, save = true) {
    this.selectedEmoji = emoji;
    if (save) localStorage.setItem("selectedEmoji", emoji);
    const selectedEmojiSpans = document.querySelectorAll(".selected-emoji")!;
    for (let selectedEmojiSpan of selectedEmojiSpans) {
      selectedEmojiSpan.textContent = this.selectedEmoji;
    }

    document.title = `Super TTT - ${this.selectedEmoji}`;
  }

  populateEmojis(emojis: string[] = []) {
    const emojiContainers = document.querySelectorAll(".emoji-container")!;

    for (let emoji of emojis) {
      for (const emojiContainer of emojiContainers) {
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
      }
    }
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
