import 'package:super_ttt_server/packet/incoming_packet.dart';

class SetCellPacket implements IncomingPacket {
  @override
  String get type => "set_cell";

  final int x1;
  final int y1;
  final int x2;
  final int y2;

  SetCellPacket({
    required this.x1,
    required this.y1,
    required this.x2,
    required this.y2,
  });

  factory SetCellPacket.fromJson(Map<String, dynamic> json) {
    return SetCellPacket(
      x1: json["x1"],
      y1: json["y1"],
      x2: json["x2"],
      y2: json["y2"],
    );
  }

  @override
  String stringify() {
    return "SetCellPacket{x1: $x1, y1: $y1, x2: $x2, y2: $y2}";
  }
}
