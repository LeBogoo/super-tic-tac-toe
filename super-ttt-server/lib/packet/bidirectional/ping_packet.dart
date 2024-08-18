import 'package:super_ttt_server/packet/incoming_packet.dart';
import 'package:super_ttt_server/packet/outgoing_packet.dart';

class PingPacket implements IncomingPacket, OutgoingPacket {
  @override
  String get type => "ping";

  final int timestamp;

  PingPacket({
    required this.timestamp,
  });

  factory PingPacket.fromJson(Map<String, dynamic> json) {
    return PingPacket(
      timestamp: json["timestamp"],
    );
  }

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "timestamp": timestamp,
    };
  }

  @override
  String stringify() {
    return "PingPacket{timestamp: $timestamp}";
  }
}
