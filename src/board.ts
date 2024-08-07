import { Cell } from "./cell";

export class Board {
  private cells: Cell[];

  constructor(private boardSize: number) {
    this.cells = new Array(boardSize * boardSize);

    // randomize cells to bei either X, O or Empty
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] =
        Math.random() < 0.33
          ? Cell.X
          : Math.random() < 0.66
          ? Cell.O
          : Cell.Empty;
    }
  }

  setCell(x: number, y: number, cell: Cell) {
    this.cells[x + y * this.boardSize] = cell;
  }

  getCell(x: number, y: number) {
    return this.cells[x + y * this.boardSize];
  }

  isRowFilled(y: number) {
    return this.cells
      .slice(y * this.boardSize, y * this.boardSize + this.boardSize)
      .every((cell) => cell !== Cell.Empty);
  }

  isColumnFilled(x: number) {
    return this.cells
      .filter((_, i) => i % this.boardSize === x)
      .every((cell) => cell !== Cell.Empty);
  }

  isDiagonalFilled() {
    return (
      this.cells
        .filter((_, i) => i % (this.boardSize + 1) === 0)
        .every((cell) => cell !== Cell.Empty) ||
      this.cells
        .filter((_, i) => i % (this.boardSize - 1) === this.boardSize - 1)
        .every((cell) => cell !== Cell.Empty)
    );
  }

  isBoardFilled() {
    return this.cells.every((cell) => cell !== Cell.Empty);
  }

  getWinner() {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.isRowFilled(i)) {
        return this.cells[i * this.boardSize];
      }
      if (this.isColumnFilled(i)) {
        return this.cells[i];
      }
    }

    if (this.isDiagonalFilled()) {
      return this.cells[this.boardSize];
    }

    return Cell.Empty;
  }

  isDraw() {
    return this.getWinner() === Cell.Empty && this.isBoardFilled();
  }

  isDone() {
    return this.isDraw() || this.getWinner() !== Cell.Empty;
  }
}
