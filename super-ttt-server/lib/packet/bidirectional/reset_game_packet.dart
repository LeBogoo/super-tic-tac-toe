import 'package:super_ttt_server/packet/incoming_packet.dart';
import 'package:super_ttt_server/packet/outgoing_packet.dart';

class ResetGamePacket implements IncomingPacket, OutgoingPacket {
  @override
  String get type => "reset_game";

  ResetGamePacket();

  factory ResetGamePacket.fromJson(Map<String, dynamic> json) {
    return ResetGamePacket();
  }

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
    };
  }
}
