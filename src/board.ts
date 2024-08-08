import { Cell } from "./cell";

export class Board {
  private cells: Cell[];
  private active: boolean = true;

  constructor(private boardSize: number) {
    this.cells = new Array(boardSize * boardSize).fill(Cell.Empty);
  }

  setCell(x: number, y: number, cell: Cell) {
    this.cells[x + y * this.boardSize] = cell;
  }

  getCell(x: number, y: number) {
    return this.cells[x + y * this.boardSize];
  }

  isActive() {
    return this.active;
  }

  setActive(active: boolean) {
    this.active = active;
  }

  isRowFilled(row: number, player: Cell) {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.getCell(i, row) !== player) {
        return false;
      }
    }
    return true;
  }

  isColumnFilled(column: number, player: Cell) {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.getCell(column, i) !== player) {
        return false;
      }
    }
    return true;
  }

  isDiagonalFilled(player: Cell) {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.getCell(i, i) !== player) {
        return false;
      }
    }
    return true;
  }

  isAntiDiagonalFilled(player: Cell) {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.getCell(i, this.boardSize - i - 1) !== player) {
        return false;
      }
    }
    return true;
  }

  isDone() {
    for (let i = 0; i < this.boardSize; i++) {
      if (
        this.isRowFilled(i, Cell.X) ||
        this.isColumnFilled(i, Cell.X) ||
        this.isDiagonalFilled(Cell.X) ||
        this.isAntiDiagonalFilled(Cell.X)
      ) {
        return true;
      }
      if (
        this.isRowFilled(i, Cell.O) ||
        this.isColumnFilled(i, Cell.O) ||
        this.isDiagonalFilled(Cell.O) ||
        this.isAntiDiagonalFilled(Cell.O)
      ) {
        return true;
      }
    }
    return false;
  }

  getWinner() {
    for (let i = 0; i < this.boardSize; i++) {
      if (
        this.isRowFilled(i, Cell.X) ||
        this.isColumnFilled(i, Cell.X) ||
        this.isDiagonalFilled(Cell.X) ||
        this.isAntiDiagonalFilled(Cell.X)
      ) {
        return Cell.X;
      }
      if (
        this.isRowFilled(i, Cell.O) ||
        this.isColumnFilled(i, Cell.O) ||
        this.isDiagonalFilled(Cell.O) ||
        this.isAntiDiagonalFilled(Cell.O)
      ) {
        return Cell.O;
      }
    }
    return null;
  }

  isDraw() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.getCell(i, j) === Cell.Empty) {
          return false;
        }
      }
    }
    return true;
  }
}
