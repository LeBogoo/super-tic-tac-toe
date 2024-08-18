import 'package:super_ttt_server/packet/incoming_packet.dart';

class JoinGamePacket implements IncomingPacket {
  @override
  String get type => "join_game";

  final String gameCode;
  final String emoji;

  JoinGamePacket({
    required this.gameCode,
    required this.emoji,
  });

  factory JoinGamePacket.fromJson(Map<String, dynamic> json) {
    return JoinGamePacket(
      gameCode: json["gameCode"],
      emoji: json["emoji"],
    );
  }

  @override
  String stringify() {
    return "JoinGamePacket{gameCode: $gameCode, emoji: $emoji}";
  }
}
