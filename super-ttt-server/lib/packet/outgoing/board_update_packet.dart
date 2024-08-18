import 'package:super_ttt_server/packet/outgoing_packet.dart';
import 'package:super_ttt_server/super_ttt/logic/super_board.dart';

class BoardUpdatePacket implements OutgoingPacket {
  @override
  String get type => "board_update";

  final SuperBoard board;

  BoardUpdatePacket({
    required this.board,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "board": board.toJson(),
    };
  }

  @override
  String stringify() {
    return "BoardUpdatePacket{board: TRUNKATED}";
  }
}
