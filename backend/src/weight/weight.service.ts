import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWeightLogDto } from './dto/add-weight.dto';

@Injectable()
export class WeightService {
  constructor(private prisma: PrismaService) {}

  async getLogs(userId: string, limit = 30) {
    return this.prisma.weightLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      take: limit,
    });
  }

  async addLog(userId: string, dto: AddWeightLogDto) {
    const log = await this.prisma.weightLog.create({
      data: { userId, ...dto },
    });

    await this.prisma.userProfile.updateMany({
      where: { userId },
      data: { currentWeight: dto.weightKg },
    });

    return log;
  }

  async deleteLog(userId: string, logId: string) {
    const log = await this.prisma.weightLog.findFirst({
      where: { id: logId, userId },
    });
    if (!log) throw new NotFoundException('Weight log perished.');

    await this.prisma.weightLog.delete({ where: { id: logId } });
    return { message: 'The measurement has been erased from time.' };
  }

  async getProgress(userId: string) {
    const logs = await this.prisma.weightLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'asc' },
    });

    if (logs.length < 2) return { logs, change: null };

    const first = logs[0];
    const last = logs[logs.length - 1];

    return {
      logs,
      change: {
        weightKg: last.weightKg - first.weightKg,
        days: Math.floor(
          (last.loggedAt.getTime() - first.loggedAt.getTime()) / (1000 * 60 * 60 * 24),
        ),
        bodyFatChange:
          first.bodyFatPercent && last.bodyFatPercent
            ? last.bodyFatPercent - first.bodyFatPercent
            : null,
      },
      current: last,
      starting: first,
    };
  }
}
