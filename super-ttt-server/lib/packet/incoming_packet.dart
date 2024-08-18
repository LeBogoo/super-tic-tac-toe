import 'package:super_ttt_server/packet/bidirectional/ping_packet.dart';
import 'package:super_ttt_server/packet/incoming/create_game_packet.dart';
import 'package:super_ttt_server/packet/incoming/find_game_packet.dart';
import 'package:super_ttt_server/packet/incoming/join_game_packet.dart';
import 'package:super_ttt_server/packet/bidirectional/reset_game_packet.dart';
import 'package:super_ttt_server/packet/incoming/set_cell_packet.dart';
import 'package:super_ttt_server/packet/incoming/stop_search_packet.dart';
import 'package:super_ttt_server/packet/packet.dart';

abstract class IncomingPacket implements Packet {
  factory IncomingPacket.fromJson(Map<String, dynamic> json) {
    // We only need to map incoming packets
    switch (json["type"]) {
      case "join_game":
        return JoinGamePacket.fromJson(json);
      case "find_game":
        return FindGamePacket.fromJson(json);
      case "create_game":
        return CreateGamePacket.fromJson(json);
      case "reset_game":
        return ResetGamePacket.fromJson(json);
      case "set_cell":
        return SetCellPacket.fromJson(json);
      case "stop_search":
        return StopSearchPacket.fromJson(json);
      case "ping":
        return PingPacket.fromJson(json);

      default:
        throw Exception("Invalid packet type: ${json["type"]}");
    }
  }
}
