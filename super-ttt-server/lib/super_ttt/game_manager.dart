import 'dart:math';

import 'package:super_ttt_server/super_ttt/game.dart';

class GameManager {
  static GameManager instance = GameManager();
  List<Game> publicGames = [];
  Map<String, Game> privateGames = {};
  static final random = Random();
  static final gameCodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  bool gameExists(String code) {
    return publicGames.any((game) => game.code == code) ||
        privateGames.containsKey(code);
  }

  String generateGameCode() {
    return List.generate(4, (index) {
      return gameCodeChars[random.nextInt(gameCodeChars.length)];
    }).join();
  }

  Game? getOpenPublicGame() {
    for (Game game in publicGames) {
      if (game.players.length < 2) {
        return game;
      }
    }
    return null;
  }

  Game? getPrivateGame(String code) {
    code = code.toUpperCase();
    return privateGames[code];
  }

  Game createGame({
    bool isPrivate = false,
  }) {
    if (isPrivate) {
      String code = generateGameCode();
      Game game = Game(code: code);
      privateGames[code] = game;
      return game;
    }

    Game game = Game();
    publicGames.add(game);
    return game;
  }

  Game createCustomGame({
    required String code,
  }) {
    code = code.toUpperCase();
    Game game = Game(code: code);
    privateGames[code] = game;
    return game;
  }

  void removeGame(Game game) {
    if (game.code != null) {
      privateGames.remove(game.code);
    } else {
      publicGames.remove(game);
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'publicGames': publicGames.map((game) => game.toJson()).toList(),
      'privateGames': privateGames.values.map((game) => game.toJson()).toList(),
    };
  }
}
