import 'package:super_ttt_server/packet/outgoing_packet.dart';

class GameStoppedPacket implements OutgoingPacket {
  @override
  String get type => "game_stopped";

  GameStoppedPacket();

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
    };
  }
}
