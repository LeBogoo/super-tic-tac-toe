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

  @override
  String stringify() {
    var trunkatedEmojis = emojis.take(10);
    var isTrunkated = trunkatedEmojis.length < emojis.length;
    return "EmojisPacket{emojis: ${trunkatedEmojis.join(", ")}${isTrunkated ? ',...' : ''}}";
  }
}
