import 'package:super_ttt_server/packet/outgoing/board_update_packet.dart';
import 'package:super_ttt_server/packet/outgoing/game_joined_packet.dart';
import 'package:super_ttt_server/packet/outgoing/game_started_packet.dart';
import 'package:super_ttt_server/packet/outgoing/game_stopped_packet.dart';
import 'package:super_ttt_server/packet/outgoing/player_turn_packet.dart';
import 'package:super_ttt_server/super_ttt/game_manager.dart';
import 'package:super_ttt_server/super_ttt/logic/board.dart';
import 'package:super_ttt_server/super_ttt/logic/cell.dart';
import 'package:super_ttt_server/super_ttt/logic/super_board.dart';
import 'package:super_ttt_server/super_ttt/player.dart';

import 'package:super_ttt_server/packet/outgoing_packet.dart';

class Game {
  final List<Player> players = [];
  final String? code;

  bool running = false;

  SuperBoard superBoard = SuperBoard(boardSize: 3);

  Cell activePlayer = Cell.x;

  Game({this.code});

  get playerCount => players.length;

  void start() {
    running = true;

    var [xPlayer, oPlayer] = players;
    broadcast(GameStartedPacket(xEmoji: xPlayer.emoji, oEmoji: oPlayer.emoji));
    broadcast(PlayerTurnPacket(cell: activePlayer));
    broadcast(BoardUpdatedPacket(board: superBoard));
  }

  void stop() {
    GameManager.instance.removeGame(this);
    running = false;
    broadcast(GameStoppedPacket());
  }

  void join(Player player) {
    player.game = this;
    players.add(player);

    if (players.length == 2) {
      player.cell = Cell.o;
      player.send(GameJoinedPacket(playerSymbol: player.cell.stringify()));
      start();
    } else {
      player.send(GameJoinedPacket(playerSymbol: player.cell.stringify()));
    }
  }

  void leave(Player player) {
    players.remove(player);
    stop();
  }

  togglePlayer() {
    activePlayer = activePlayer == Cell.x ? Cell.o : Cell.x;
  }

  bool setCell(x1, y1, x2, y2, Cell cell) {
    Board superCell = superBoard.getSuperCell(x1, y1);
    if (superCell.isActive() && superCell.getCell(x2, y2) == Cell.empty) {
      superCell.setCell(x2, y2, activePlayer);

      bool isWildcard = superBoard.getSuperCell(x2, y2).isDone();

      for (var x3 = 0; x3 < superBoard.boardSize; x3++) {
        for (var y3 = 0; y3 < superBoard.boardSize; y3++) {
          superBoard.getSuperCell(x3, y3).setActive(isWildcard);
        }
      }

      if (!isWildcard) {
        superBoard.getSuperCell(x2, y2).setActive(true);
      }

      togglePlayer();

      broadcast(PlayerTurnPacket(cell: activePlayer));
      broadcast(BoardUpdatedPacket(board: superBoard));
    }

    return true;
  }

  void broadcast(OutgoingPacket packet) {
    for (Player player in players) {
      player.send(packet);
    }
  }

  @override
  String toString() {
    return "Game{$players, $running, $superBoard, $activePlayer}";
  }
}
