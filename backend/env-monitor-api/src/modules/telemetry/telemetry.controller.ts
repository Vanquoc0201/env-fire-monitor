import { Controller, Get, Query } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get('latest')
  async getLatest() {
    return this.telemetryService.getLatestTelemetry();
  }

  @Get('history')
  async getHistory(@Query('limit') limit?: number) {
    return this.telemetryService.getTelemetryHistory(limit ? Number(limit) : 20);
  }
}