import 'package:super_ttt_server/packet/incoming_packet.dart';

class StopSearchPacket implements IncomingPacket {
  @override
  String get type => "stop_search";

  StopSearchPacket();

  factory StopSearchPacket.fromJson(Map<String, dynamic> json) {
    return StopSearchPacket();
  }
}
