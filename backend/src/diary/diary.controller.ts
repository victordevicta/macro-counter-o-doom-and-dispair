import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiaryService } from './diary.service';
import { AddFoodEntryDto, UpdateFoodEntryDto } from './dto/add-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('diary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  @ApiOperation({ summary: 'View the dark tome for a day' })
  getDailyDiary(
    @CurrentUser('id') userId: string,
    @Query('date') date: string,
  ) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.diaryService.getDailyDiary(userId, targetDate);
  }

  @Get('week')
  @ApiOperation({ summary: 'View a week of suffering' })
  getWeekSummary(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate: string,
  ) {
    const start = startDate || new Date().toISOString().split('T')[0];
    return this.diaryService.getWeekSummary(userId, start);
  }

  @Post('entries')
  @ApiOperation({ summary: 'Inscribe sustenance into the tome' })
  addFoodEntry(
    @CurrentUser('id') userId: string,
    @Body() dto: AddFoodEntryDto,
  ) {
    return this.diaryService.addFoodEntry(userId, dto);
  }

  @Put('entries/:id')
  @ApiOperation({ summary: 'Alter the cursed inscription' })
  updateFoodEntry(
    @CurrentUser('id') userId: string,
    @Param('id') entryId: string,
    @Body() dto: UpdateFoodEntryDto,
  ) {
    return this.diaryService.updateFoodEntry(userId, entryId, dto);
  }

  @Delete('entries/:id')
  @ApiOperation({ summary: 'Purge the morsel from record' })
  deleteFoodEntry(
    @CurrentUser('id') userId: string,
    @Param('id') entryId: string,
  ) {
    return this.diaryService.deleteFoodEntry(userId, entryId);
  }

  @Post('copy-meal')
  @ApiOperation({ summary: 'Copy a cursed meal from another day' })
  copyMeal(
    @CurrentUser('id') userId: string,
    @Body()
    body: {
      fromDate: string;
      fromMealType: string;
      toDate: string;
    },
  ) {
    return this.diaryService.copyMeal(
      userId,
      body.fromDate,
      body.fromMealType,
      body.toDate,
    );
  }
}
