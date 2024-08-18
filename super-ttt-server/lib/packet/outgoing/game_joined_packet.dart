import 'package:super_ttt_server/packet/outgoing_packet.dart';

class GameJoinedPacket implements OutgoingPacket {
  @override
  String get type => "game_joined";
  final String playerSymbol;

  GameJoinedPacket({required this.playerSymbol});

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "playerSymbol": playerSymbol,
    };
  }

  @override
  String stringify() {
    return "GameJoinedPacket{playerSymbol: $playerSymbol}";
  }
}
