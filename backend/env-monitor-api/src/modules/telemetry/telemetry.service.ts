import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TelemetryService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Lấy bản ghi cảm biến mới nhất
  async getLatestTelemetry() {
    return this.prisma.telemetryLog.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. Lấy lịch sử N bản ghi gần nhất để vẽ biểu đồ
  async getTelemetryHistory(limit = 20) {
    return this.prisma.telemetryLog.findMany({
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
  }
}