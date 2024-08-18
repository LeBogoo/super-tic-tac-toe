import 'package:super_ttt_server/packet/outgoing_packet.dart';

class EmojisPacket implements OutgoingPacket {
  @override
  String get type => "emojis";

  final List<String> emojis;

  EmojisPacket({
    required this.emojis,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "emojis": emojis,
    };
  }
}
