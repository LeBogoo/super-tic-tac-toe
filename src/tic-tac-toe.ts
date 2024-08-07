import { Cell } from "./cell";
import { SuperBoard } from "./super-board";

export class TicTacToe {
  private superBoard: SuperBoard;

  constructor(private boardSize: number) {
    this.superBoard = new SuperBoard(boardSize);

    console.log(this.superBoard);
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
          superCellElement.classList.add("cell", "finish-cell", "disabled");
          superCellElement.textContent = superCell.getWinner() || "T";
        } else {
          superCellElement.classList.add("super-cell");
          for (let x2 = 0; x2 < this.boardSize; x2++) {
            for (let y2 = 0; y2 < this.boardSize; y2++) {
              let cellElement = document.createElement("button");
              cellElement.classList.add("cell", "grid-cell");

              const cell = superCell.getCell(x2, y2);

              if (cell !== Cell.Empty) {
                cellElement.classList.add("disabled", cell);
                cellElement.textContent = cell;
              }
              // TODO - Add click event listener

              superCellElement.appendChild(cellElement);
            }
          }
        }

        superBoard.appendChild(superCellElement);
      }
    }
  }
}
