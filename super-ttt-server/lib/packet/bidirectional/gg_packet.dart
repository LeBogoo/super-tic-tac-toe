import 'package:super_ttt_server/packet/incoming_packet.dart';
import 'package:super_ttt_server/packet/outgoing_packet.dart';
import 'package:super_ttt_server/super_ttt/logic/cell.dart';

class GGPacket implements IncomingPacket, OutgoingPacket {
  @override
  String get type => "gg";

  final Cell player;

  GGPacket({
    required this.player,
  });

  factory GGPacket.fromJson(Map<String, dynamic> json) {
    return GGPacket(
      player: CellExtension.fromString(json["player"]),
    );
  }

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "player": player.stringify(),
    };
  }

  @override
  String stringify() {
    return "GGPacket{player: ${player.stringify()}}";
  }
}
