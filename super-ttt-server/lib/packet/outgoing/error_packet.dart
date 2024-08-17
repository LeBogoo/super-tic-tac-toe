import 'package:super_ttt_server/packet/outgoing_packet.dart';

class ErrorPacket implements OutgoingPacket {
  @override
  String get type => "error";

  final String errorMessage;
  final Map<String, dynamic> data;

  ErrorPacket({
    required this.errorMessage,
    this.data = const {},
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "errorMessage": errorMessage,
      "data": data,
    };
  }
}
