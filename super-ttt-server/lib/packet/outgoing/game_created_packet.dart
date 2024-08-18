import 'package:super_ttt_server/packet/outgoing_packet.dart';

class GameCreatedPacket implements OutgoingPacket {
  @override
  String get type => "game_created";

  final String? gameCode;

  GameCreatedPacket({
    this.gameCode,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "gameCode": gameCode,
    };
  }

  @override
  String stringify() {
    return "GameCreatedPacket{gameCode: $gameCode}";
  }
}
