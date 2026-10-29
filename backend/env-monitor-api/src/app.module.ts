import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [HealthModule, MqttModule, TelemetryModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
