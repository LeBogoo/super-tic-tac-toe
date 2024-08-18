import 'dart:async';
import 'dart:convert';

import 'package:super_ttt_server/packet/bidirectional/ping_packet.dart';
import 'package:super_ttt_server/super_ttt/event/disconnect_event.dart';
import 'package:super_ttt_server/super_ttt/player.dart';
import 'package:super_ttt_server/packet/incoming_packet.dart';
import 'package:super_ttt_server/packet/outgoing/error_packet.dart';
import 'package:super_ttt_server/packet/outgoing_packet.dart';
import 'package:super_ttt_server/packet/packet.dart';
import 'package:web_socket_channel/io.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class Connection {
  int _lastRecievedPing = 0;

  final IOWebSocketChannel? webSocket;
  Stream<dynamic> get stream {
    if (webSocket == null) return Stream.empty();
    return webSocket!.stream;
  }

  WebSocketSink get sink {
    if (webSocket == null) throw Exception("WebSocket is null");
    return webSocket!.sink;
  }

  int? get closeCode {
    if (webSocket == null) throw Exception("WebSocket is null");
    return webSocket!.closeCode;
  }

  String? get closeReason {
    if (webSocket == null) throw Exception("WebSocket is null");
    return webSocket!.closeReason;
  }

  final Map<Type, List<Function>> callbacks = {};
  Player? player;

  Connection(this.webSocket) {
    if (webSocket == null) return;
    stream.listen((message) {
      print("↙️ $message");

      final Map<String, dynamic> jsonMessage = json.decode(message as String);

      try {
        Packet packet = IncomingPacket.fromJson(jsonMessage);
        // get type of packet
        Type type = packet.runtimeType;
        if (callbacks.containsKey(type)) {
          for (var callback in callbacks[type]!) {
            callback(packet);
          }
        }
      } catch (error) {
        print("❗ Error: $error");
        send(ErrorPacket(errorMessage: error.toString()));
      }
    });

    stream.handleError((error) {
      print("❗ Error: $error");
      triggerDisconnectEvent();
    });

    sink.done.then((value) {
      print("❌ Connection closed: $closeCode $closeReason");
      triggerDisconnectEvent();
    });

    Timer.periodic(Duration(seconds: 30), (timer) {
      send(PingPacket(timestamp: DateTime.now().millisecondsSinceEpoch));

      const int pingTimeout = 5;

      // set another time to wait for the response
      Future.delayed(Duration(seconds: pingTimeout), () {
        // check if lastrecieved ping is more than 5 seconds
        if (DateTime.now().millisecondsSinceEpoch - _lastRecievedPing >
            (pingTimeout + 1) * 1000) {
          print("❌ Ping timeout");
          webSocket!.sink.close(1000, "Ping timeout");
          timer.cancel();
        }
      });
    });

    on<PingPacket>((packet) {
      _lastRecievedPing = packet.timestamp;
    });
  }

  factory Connection.empty() {
    return Connection(null);
  }

  void send(OutgoingPacket packet) {
    String message = json.encode(packet.toJson());

    print("↗️ $message");

    sink.add(message);
  }

  void close() {
    sink.close();
    triggerDisconnectEvent();
  }

  void triggerDisconnectEvent() {
    if (callbacks.containsKey(DisconnectEvent)) {
      for (var callback in callbacks[DisconnectEvent]!) {
        callback(DisconnectEvent());
      }
    }
  }

  void on<T>(Function(T) callback) {
    if (!callbacks.containsKey(T)) {
      callbacks[T] = [];
    }
    callbacks[T]!.add(callback);
  }
}
