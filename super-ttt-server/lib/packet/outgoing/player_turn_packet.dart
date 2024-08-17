import 'package:super_ttt_server/packet/outgoing_packet.dart';
import 'package:super_ttt_server/super_ttt/logic/cell.dart';

class PlayerTurnPacket implements OutgoingPacket {
  @override
  String get type => "player_turn";

  final Cell cell;

  PlayerTurnPacket({
    required this.cell,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "cell": cell.stringify(),
    };
  }
}
