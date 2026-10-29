import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { PrismaService } from '../../prisma/prisma.service';
import { TelemetryGateway } from '../telemetry/telemetry.gateway';
import { MQTT_BROKER_URL, MQTT_TOPIC_TELEMETRY } from '../../common/constant/app.constant';

@Injectable()
export class MqttService implements OnModuleInit {
  private client!: mqtt.MqttClient;
  private readonly logger = new Logger(MqttService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetryGateway: TelemetryGateway,
  ) {}

  onModuleInit() {
    this.client = mqtt.connect(MQTT_BROKER_URL!);

    this.client.on('connect', () => {
      this.logger.log(`Connected to MQTT Broker (${MQTT_BROKER_URL}) successfully!`);

      this.client!.subscribe(MQTT_TOPIC_TELEMETRY!, (err) => {
        if (!err) {
          this.logger.log(`Subscribed to topic: ${MQTT_TOPIC_TELEMETRY}`);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        this.logger.log(`Received payload: ${JSON.stringify(payload)}`);

        const savedLog = await this.prisma.telemetryLog.create({
          data: {
            deviceId: payload.deviceId || 'ESP32_FIRE_MONITOR',
            temperature: Number(payload.temperature),
            humidity: Number(payload.humidity),
            gas: Number(payload.gas),
            flame: Boolean(payload.flame),
          },
        });

        this.telemetryGateway.sendTelemetryUpdate(savedLog);
        this.logger.log('Emitted real-time telemetry data to WebSocket clients!');
      } catch (error) {
        this.logger.error('Error parsing JSON or saving to DB:', error);
      }
    });
  }
}