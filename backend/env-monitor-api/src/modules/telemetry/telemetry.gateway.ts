import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TelemetryGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Frontend WebSocket Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Frontend WebSocket Client disconnected: ${client.id}`);
  }

  // Hàm bắn dữ liệu Realtime xuống tất cả Frontend đang mở Dashboard
  sendTelemetryUpdate(data: any) {
    this.server.emit('telemetryData', data);
  }
}