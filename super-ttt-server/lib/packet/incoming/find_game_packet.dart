import 'package:super_ttt_server/packet/incoming_packet.dart';

class FindGamePacket implements IncomingPacket {
  @override
  String get type => "find_game";

  final String emoji;

  FindGamePacket({
    required this.emoji,
  });

  factory FindGamePacket.fromJson(Map<String, dynamic> json) {
    return FindGamePacket(
      emoji: json["emoji"],
    );
  }
}
