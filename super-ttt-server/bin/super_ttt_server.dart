import 'package:super_ttt_server/packet/incoming/create_game_packet.dart';
import 'package:super_ttt_server/packet/incoming/find_game_packet.dart';
import 'package:super_ttt_server/packet/incoming/join_game_packet.dart';
import 'package:super_ttt_server/packet/incoming/stop_search_packet.dart';
import 'package:super_ttt_server/packet/outgoing/emojis_packet.dart';
import 'package:super_ttt_server/packet/outgoing/error_packet.dart';
import 'package:super_ttt_server/packet/outgoing/game_created_packet.dart';
import 'package:super_ttt_server/packet/outgoing/waiting_for_game_packet.dart';
import 'package:super_ttt_server/super_ttt/emoji_manager.dart';
import 'package:super_ttt_server/super_ttt/game.dart';
import 'package:super_ttt_server/super_ttt/game_manager.dart';
import 'package:super_ttt_server/super_ttt/player.dart';
import 'package:super_ttt_server/websocket/connection.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_web_socket/shelf_web_socket.dart';
import 'package:web_socket_channel/io.dart';

void main() {
  var handler =
      webSocketHandler((IOWebSocketChannel webSocket, String? protocol) async {
    if (protocol == null || protocol != 'super-ttt') {
      webSocket.sink.close(1002, 'Invalid protocol');
      return;
    }

    print("🔗 New connection");
    Connection connection = Connection(webSocket);

    connection
        .send(EmojisPacket(emojis: await EmojiManager.instance.getEmojis()));

    // Join Private Game
    connection.on<JoinGamePacket>((packet) {
      if (connection.player != null) {
        connection.send(ErrorPacket(errorMessage: "Already in a game"));
        return;
      }

      Game? game = GameManager.instance.getPrivateGame(packet.gameCode);
      if (game == null) {
        connection.send(ErrorPacket(errorMessage: "Game not found"));
        return;
      }

      if (game.players.length >= 2) {
        connection.send(ErrorPacket(errorMessage: "Game is full"));
        return;
      }

      bool emojiValid = EmojiManager.instance.validateEmoji(packet.emoji);
      if (!emojiValid) {
        connection.send(ErrorPacket(errorMessage: "Invalid emoji"));
        return;
      }

      if (game.players[0].emoji == packet.emoji) {
        connection.send(ErrorPacket(
            errorMessage:
                "Someone is already using this emoji in the game you are trying to join"));
        return;
      }

      connection.player = Player(
        connection: connection,
        emoji: packet.emoji,
        game: game,
      );
    });

    // Create Private Game
    connection.on<CreateGamePacket>((packet) {
      if (connection.player != null) {
        connection.send(ErrorPacket(errorMessage: "Already in a game"));
        return;
      }

      bool emojiValid = EmojiManager.instance.validateEmoji(packet.emoji);
      if (!emojiValid) {
        connection.send(ErrorPacket(errorMessage: "Invalid emoji"));
        return;
      }

      Game game = GameManager.instance.createGame(isPrivate: true);

      connection.player = Player(
        connection: connection,
        emoji: packet.emoji,
        game: game,
      );

      connection.player!.send(GameCreatedPacket(gameCode: game.code));
    });

    // Find Random Game
    connection.on<FindGamePacket>((packet) {
      print("🔍 Finding game for some player...");

      if (connection.player != null) {
        connection.send(ErrorPacket(errorMessage: "Already in a game"));
        return;
      }

      bool emojiValid = EmojiManager.instance.validateEmoji(packet.emoji);
      if (!emojiValid) {
        connection.send(ErrorPacket(errorMessage: "Invalid emoji"));
        return;
      }

      Game? game = GameManager.instance.getOpenPublicGame();
      if (game != null) {
        if (game.players[0].emoji == packet.emoji) {
          connection.send(ErrorPacket(
              errorMessage:
                  "Someone is already using this emoji in the game you are trying to join"));
          return;
        }
      }

      game ??= GameManager.instance.createGame();

      connection.player = Player(
        connection: connection,
        emoji: packet.emoji,
        game: game,
      );
      if (game.players.length != 2) {
        connection.send(WaitingForGamePacket());
      }
    });

    // Stop Search
    connection.on<StopSearchPacket>((packet) {
      if (connection.player == null) {
        connection.send(ErrorPacket(errorMessage: "Not in a game"));
        return;
      }

      connection.player!.game.stop();
      connection.player = null;
    });
  }, protocols: ['super-ttt']);

  shelf_io
      .serve(handler, 'localhost', 8080,
          poweredByHeader: "Super Tic Tac Toe Server")
      .then((server) {
    print('Serving at ws://${server.address.host}:${server.port}');
  });
}
