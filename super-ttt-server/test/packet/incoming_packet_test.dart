import 'package:super_ttt_server/packet/incoming/join_game_packet.dart';
import 'package:test/test.dart';
import 'package:super_ttt_server/packet/incoming_packet.dart';
import 'package:super_ttt_server/packet/incoming/create_game_packet.dart';

void main() {
  group('IncomingPacket.fromJson', () {
    test('should create CreateGamePacket from JSON', () {
      final json = {
        "type": "create_game",
        "emoji": "🤖",
      };
      final packet = IncomingPacket.fromJson(json) as CreateGamePacket;
      expect(packet.type, "create_game");
      expect(packet.emoji, "🤖");
    });

    test('should create JoinGamePacket from JSON', () {
      final json = {
        "type": "join_game",
        "emoji": "🤖",
        "gameCode": "1234",
      };
      final packet = IncomingPacket.fromJson(json) as JoinGamePacket;
      expect(packet.type, "join_game");
      expect(packet.emoji, "🤖");
      expect(packet.gameCode, "1234");
    });

    test('should throw exception for invalid packet type', () {
      final json = {
        "type": "invalid_type",
      };
      expect(() => IncomingPacket.fromJson(json), throwsException);
    });
  });
}
