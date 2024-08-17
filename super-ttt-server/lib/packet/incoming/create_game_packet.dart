import 'package:super_ttt_server/packet/incoming_packet.dart';

class CreateGamePacket implements IncomingPacket {
  final String emoji;

  @override
  String get type => "create_game";

  CreateGamePacket({required this.emoji});

  factory CreateGamePacket.fromJson(Map<String, dynamic> json) {
    return CreateGamePacket(
      emoji: json["emoji"],
    );
  }
}
