import 'package:super_ttt_server/packet/outgoing_packet.dart';

class DrawEndPacket implements OutgoingPacket {
  @override
  String get type => "draw_end";

  DrawEndPacket();

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
    };
  }
}
