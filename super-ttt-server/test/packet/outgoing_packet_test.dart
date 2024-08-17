import 'package:test/test.dart';
import 'package:super_ttt_server/packet/outgoing/error_packet.dart';
import 'package:super_ttt_server/packet/outgoing/game_started_packet.dart';

void main() {
  group('OutgoingPacket', () {
    // TODO - write test for board update packet

    test('should create GameStartedPacket and serialize to JSON', () {
      final packet = GameStartedPacket(xEmoji: "❌", oEmoji: "⭕");
      final json = packet.toJson();
      expect(json["type"], "game_started");
    });

    test('should create ErrorPacket and serialize to JSON', () {
      final packet = ErrorPacket(errorMessage: "An error occurred");
      final json = packet.toJson();
      expect(json["type"], "error");
      expect(json["errorMessage"], "An error occurred");
      expect(json["data"], {});
    });

    test('should create ErrorPacket with data and serialize to JSON', () {
      final packet = ErrorPacket(
        errorMessage: "An error occurred",
        data: {"key": "value"},
      );
      final json = packet.toJson();
      expect(json["type"], "error");
      expect(json["errorMessage"], "An error occurred");
      expect(json["data"], {"key": "value"});
    });
  });
}
