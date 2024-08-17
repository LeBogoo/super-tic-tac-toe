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
}
