import { Board } from "./board";
import { Cell } from "./cell";

export class SuperBoard {
  private superCells: Board[];

  constructor(private boardSize: number) {
    this.superCells = new Array(boardSize * boardSize);

    for (let i = 0; i < this.superCells.length; i++) {
      this.superCells[i] = new Board(boardSize);
    }
  }

  setSuperCell(x: number, y: number, superCell: Board) {
    this.superCells[x + y * this.boardSize] = superCell;
  }

  getSuperCell(x: number, y: number) {
    return this.superCells[x + y * this.boardSize];
  }

  isRowFilled(y: number) {
    // a cell is filled if it is superCell.isDone();
    return this.superCells
      .slice(y * this.boardSize, y * this.boardSize + this.boardSize)
      .every((superCell) => superCell.isDone());
  }

  isColumnFilled(x: number) {
    return this.superCells
      .filter((_, i) => i % this.boardSize === x)
      .every((superCell) => superCell.isDone());
  }

  isDiagonalFilled() {
    return (
      this.superCells
        .filter((_, i) => i % (this.boardSize + 1) === 0)
        .every((superCell) => superCell.isDone()) ||
      this.superCells
        .filter((_, i) => i % (this.boardSize - 1) === this.boardSize - 1)
        .every((superCell) => superCell.isDone())
    );
  }

  isBoardFilled() {
    return this.superCells.every((superCell) => superCell.isDone());
  }

  getWinner() {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.isRowFilled(i)) {
        return this.superCells[i * this.boardSize].getWinner();
      }
      if (this.isColumnFilled(i)) {
        return this.superCells[i].getWinner();
      }
    }

    if (this.isDiagonalFilled()) {
      return this.superCells[this.boardSize].getWinner();
    }

    return Cell.Empty;
  }

  isDraw() {
    return this.getWinner() === null && this.isBoardFilled();
  }

  isDone() {
    return this.isDraw() || this.getWinner() !== Cell.Empty;
  }
}
