import 'package:super_ttt_server/packet/outgoing_packet.dart';
import 'package:super_ttt_server/super_ttt/logic/cell.dart';

class WinEndPacket implements OutgoingPacket {
  @override
  String get type => "win_end";
  final Cell winner;

  WinEndPacket({required this.winner});

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "winner": winner.stringify(),
    };
  }
}
