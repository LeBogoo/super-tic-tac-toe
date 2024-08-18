import 'package:super_ttt_server/super_ttt/logic/cell.dart';

class Board {
  List<Cell> cells = [];
  bool active = true;
  int boardSize;

  Board({this.boardSize = 3}) {
    for (var i = 0; i < boardSize * boardSize; i++) {
      cells.add(Cell.empty);
    }
  }

  setCell(int x, int y, Cell cell) {
    cells[x + y * boardSize] = cell;
  }

  getCell(int x, int y) {
    return cells[x + y * boardSize];
  }

  isActive() {
    return active;
  }

  setActive(bool active) {
    this.active = active;
  }

  isRowFilled(int row, Cell cellType) {
    for (var i = 0; i < boardSize; i++) {
      if (getCell(i, row) != cellType) {
        return false;
      }
    }
    return true;
  }

  isColumnFilled(int column, Cell cellType) {
    for (var i = 0; i < boardSize; i++) {
      if (getCell(column, i) != cellType) {
        return false;
      }
    }
    return true;
  }

  isDiagonalFilled(Cell player) {
    for (var i = 0; i < boardSize; i++) {
      if (getCell(i, i) != player) {
        return false;
      }
    }
    return true;
  }

  isAntiDiagonalFilled(Cell player) {
    for (var i = 0; i < boardSize; i++) {
      if (getCell(i, boardSize - i - 1) != player) {
        return false;
      }
    }
    return true;
  }

  isDone() {
    for (var i = 0; i < boardSize; i++) {
      if (isRowFilled(i, Cell.x) ||
          isColumnFilled(i, Cell.x) ||
          isDiagonalFilled(Cell.x) ||
          isAntiDiagonalFilled(Cell.x)) {
        return true;
      }
      if (isRowFilled(i, Cell.o) ||
          isColumnFilled(i, Cell.o) ||
          isDiagonalFilled(Cell.o) ||
          isAntiDiagonalFilled(Cell.o)) {
        return true;
      }
    }
    return false;
  }

  getWinner() {
    for (var i = 0; i < boardSize; i++) {
      if (isRowFilled(i, Cell.x) ||
          isColumnFilled(i, Cell.x) ||
          isDiagonalFilled(Cell.x) ||
          isAntiDiagonalFilled(Cell.x)) {
        return Cell.x;
      }
      if (isRowFilled(i, Cell.o) ||
          isColumnFilled(i, Cell.o) ||
          isDiagonalFilled(Cell.o) ||
          isAntiDiagonalFilled(Cell.o)) {
        return Cell.o;
      }
    }
    return null;
  }

  isDraw() {
    for (var i = 0; i < boardSize; i++) {
      for (var j = 0; j < boardSize; j++) {
        if (getCell(i, j) == Cell.empty) {
          return false;
        }
      }
    }
    return true;
  }

  Map<String, dynamic> toJson() {
    return {
      'cells': cells.map((e) => e.stringify()).toList(),
      'active': active,
    };
  }
}
