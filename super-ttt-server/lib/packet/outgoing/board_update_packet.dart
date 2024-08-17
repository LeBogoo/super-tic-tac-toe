import 'package:super_ttt_server/packet/outgoing_packet.dart';
import 'package:super_ttt_server/super_ttt/logic/super_board.dart';

class BoardUpdatedPacket implements OutgoingPacket {
  @override
  String get type => "board_update";

  final SuperBoard board;

  BoardUpdatedPacket({
    required this.board,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "board": board,
    };
  }
}
