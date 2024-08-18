import 'dart:async';
import 'dart:io';

class EmojiManager {
  static final EmojiManager instance = EmojiManager();

  List<String> emojiCache = [];
  List<String> secretEmojis = [];

  EmojiManager() {
    Timer.periodic(Duration(minutes: 5), (timer) {
      updateCache();
    });

    updateCache();
  }

  bool validateEmoji(String emoji) {
    return emojiCache.contains(emoji) || secretEmojis.contains(emoji);
  }

  Future<List<String>> getEmojis() async {
    if (emojiCache.isEmpty) {
      await updateCache();
    }

    return emojiCache;
  }

  Future<void> updateCache() async {
    String content = await File('res/emojis.txt').readAsString();
    emojiCache = content.split('\n').map((e) => e.trim()).toList();

    String secretContent = await File('res/secret_emojis.txt').readAsString();
    secretEmojis = secretContent.split('\n').map((e) => e.trim()).toList();
  }
}
