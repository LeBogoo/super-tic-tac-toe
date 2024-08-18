import "package:super_ttt_server/super_ttt/logic/board.dart";
import "package:super_ttt_server/super_ttt/logic/cell.dart";

class SuperBoard {
  List<Board> superCells = [];
  int boardSize;

  SuperBoard({this.boardSize = 3}) {
    for (int i = 0; i < boardSize * boardSize; i++) {
      superCells.add(Board(boardSize: boardSize));
    }
  }

  setSuperCell(int x, int y, Board superCell) {
    superCells[x + y * boardSize] = superCell;
  }

  void disable() {
    for (int i = 0; i < boardSize * boardSize; i++) {
      superCells[i].setActive(false);
    }
  }

  Board getSuperCell(int x, int y) {
    return superCells[x + y * boardSize];
  }

  bool isRowFilled(int row, Cell player) {
    for (int i = 0; i < boardSize; i++) {
      if (getSuperCell(i, row).getWinner() != player) {
        return false;
      }
    }
    return true;
  }

  bool isColumnFilled(int column, Cell player) {
    for (int i = 0; i < boardSize; i++) {
      if (getSuperCell(column, i).getWinner() != player) {
        return false;
      }
    }
    return true;
  }

  bool isDiagonalFilled(Cell player) {
    for (int i = 0; i < boardSize; i++) {
      if (getSuperCell(i, i).getWinner() != player) {
        return false;
      }
    }
    return true;
  }

  bool isAntiDiagonalFilled(Cell player) {
    for (int i = 0; i < boardSize; i++) {
      if (getSuperCell(i, boardSize - i - 1).getWinner() != player) {
        return false;
      }
    }
    return true;
  }

  bool isDone() {
    for (int i = 0; i < boardSize; i++) {
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

  Cell getWinner() {
    for (int i = 0; i < boardSize; i++) {
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
    return Cell.empty;
  }

  bool isDraw() {
    return isDone() && getWinner() == Cell.empty;
  }

  Map<String, dynamic> toJson() {
    return {
      "superCells": superCells.map((e) => e.toJson()).toList(),
    };
  }
}
