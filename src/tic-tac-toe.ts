import { Cell } from "./cell";
import { SuperBoard } from "./super-board";

export class TicTacToe {
  private superBoard: SuperBoard;
  private activePlayer: Cell = Cell.X;

  constructor(private boardSize: number) {
    this.superBoard = new SuperBoard(boardSize);

    console.log(this.superBoard);
  }

  private togglePlayer() {
    this.activePlayer = this.activePlayer === Cell.X ? Cell.O : Cell.X;
  }

  render() {
    const superBoard = document.getElementById("super-board") as HTMLDivElement;
    superBoard.innerHTML = "";

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        let superCellElement = document.createElement("div");
        superCellElement;

        const superCell = this.superBoard.getSuperCell(x, y);
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

          for (let x2 = 0; x2 < this.boardSize; x2++) {
            for (let y2 = 0; y2 < this.boardSize; y2++) {
              let cellElement = document.createElement("button");
              cellElement.classList.add("cell", "grid-cell");

              const cell = superCell.getCell(x2, y2);

              if (cell !== Cell.Empty) {
                cellElement.classList.add("disabled", cell);
              }

              if (superCell.isActive()) {
                cellElement.addEventListener("click", () => {
                  if (superCell.isActive() && cell === Cell.Empty) {
                    superCell.setCell(x2, y2, this.activePlayer);
                    console.log(x2, y2);

                    let isWildcard = this.superBoard
                      .getSuperCell(x2, y2)
                      .isDone();

                    for (let x3 = 0; x3 < this.boardSize; x3++) {
                      for (let y3 = 0; y3 < this.boardSize; y3++) {
                        this.superBoard
                          .getSuperCell(x3, y3)
                          .setActive(isWildcard);
                      }
                    }

                    if (!isWildcard) {
                      this.superBoard.getSuperCell(x2, y2).setActive(true);
                    }

                    this.togglePlayer();
                    this.render();
                  }
                });
              }

              superCellElement.appendChild(cellElement);
            }
          }
        }

        superBoard.appendChild(superCellElement);
      }
    }
  }
}
