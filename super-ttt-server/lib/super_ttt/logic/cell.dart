enum Cell {
  empty,
  x,
  o,
}

extension CellExtension on Cell {
  String stringify() {
    switch (this) {
      case Cell.x:
        return 'x';
      case Cell.o:
        return 'o';
      default:
        return '';
    }
  }

  static Cell fromString(String string) {
    switch (string) {
      case 'x':
        return Cell.x;
      case 'o':
        return Cell.o;
      default:
        return Cell.empty;
    }
  }
}
