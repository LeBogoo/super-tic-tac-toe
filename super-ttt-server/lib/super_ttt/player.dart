import 'package:super_ttt_server/packet/incoming/set_cell_packet.dart';
import 'package:super_ttt_server/super_ttt/event/disconnect_event.dart';
import 'package:super_ttt_server/super_ttt/game.dart';
import 'package:super_ttt_server/packet/outgoing_packet.dart';
import 'package:super_ttt_server/super_ttt/logic/cell.dart';
import 'package:super_ttt_server/websocket/connection.dart';

class Player {
  final Connection connection;
  Game game;
  final String emoji;
  Cell cell = Cell.x;

  Player({
    required this.connection,
    required this.emoji,
    required this.game,
  }) {
    game.join(this);
    connection.on<DisconnectEvent>((event) {
      leaveGame();
    });

    connection.on<SetCellPacket>((event) {
      if (game.activePlayer == cell) {
        game.setCell(event.x1, event.y1, event.x2, event.y2, cell);
      }
    });
  }

  void leaveGame() {
    game.leave(this);
    if (connection.closeCode == null) connection.close();
  }

  Map<String, dynamic> toJson() {
    return {
      "emoji": emoji,
    };
  }

  void send(OutgoingPacket packet) {
    connection.send(packet);
  }
}
