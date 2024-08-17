import { Board } from "./board";
import { Cell } from "./cell";

export class SuperBoard {
  private superCells: Board[];

  constructor(public boardSize: number) {
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

  isRowFilled(row: number, player: Cell) {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.getSuperCell(i, row).getWinner() !== player) {
        return false;
      }
    }
    return true;
  }

  isColumnFilled(column: number, player: Cell) {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.getSuperCell(column, i).getWinner() !== player) {
        return false;
      }
    }
    return true;
  }

  isDiagonalFilled(player: Cell) {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.getSuperCell(i, i).getWinner() !== player) {
        return false;
      }
    }
    return true;
  }

  isAntiDiagonalFilled(player: Cell) {
    for (let i = 0; i < this.boardSize; i++) {
      if (this.getSuperCell(i, this.boardSize - i - 1).getWinner() !== player) {
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

  static fromJson(json: {
    superCells: {
      cells: string[];
      active: boolean;
    }[];
  }) {
    const superBoard = new SuperBoard(Math.sqrt(json.superCells.length));

    json.superCells.forEach((superCell, index) => {
      const board = Board.fromJson(superCell);

      superBoard.setSuperCell(
        index % superBoard.boardSize,
        Math.floor(index / superBoard.boardSize),
        board
      );
    });

    return superBoard;
  }
}
