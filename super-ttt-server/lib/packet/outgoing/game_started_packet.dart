import 'package:super_ttt_server/packet/outgoing_packet.dart';

class GameStartedPacket implements OutgoingPacket {
  @override
  String get type => "game_started";
  final String xEmoji;
  final String oEmoji;

  GameStartedPacket({
    required this.xEmoji,
    required this.oEmoji,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "xEmoji": xEmoji,
      "oEmoji": oEmoji,
    };
  }

  @override
  String stringify() {
    return "GameStartedPacket{xEmoji: $xEmoji, oEmoji: $oEmoji}";
  }
}
