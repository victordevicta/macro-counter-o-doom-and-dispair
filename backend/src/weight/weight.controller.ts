import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WeightService } from './weight.service';
import { AddWeightLogDto } from './dto/add-weight.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('weight')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get()
  @ApiOperation({ summary: 'Get weight logs' })
  getLogs(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.weightService.getLogs(userId, limit ? parseInt(limit) : 30);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get weight progress' })
  getProgress(@CurrentUser('id') userId: string) {
    return this.weightService.getProgress(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Log a weight entry' })
  addLog(@CurrentUser('id') userId: string, @Body() dto: AddWeightLogDto) {
    return this.weightService.addLog(userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a weight entry' })
  deleteLog(@CurrentUser('id') userId: string, @Param('id') logId: string) {
    return this.weightService.deleteLog(userId, logId);
  }
}
