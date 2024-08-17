import 'package:super_ttt_server/packet/outgoing_packet.dart';

class WaitingForGamePacket implements OutgoingPacket {
  @override
  String get type => "waiting_for_game";

  WaitingForGamePacket();

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
    };
  }
}
