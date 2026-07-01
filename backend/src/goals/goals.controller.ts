import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { UpdateGoalsDto } from './dto/update-goals.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  @ApiOperation({ summary: 'View the ordained nutritional decree' })
  getGoals(@CurrentUser('id') userId: string) {
    return this.goalsService.getGoals(userId);
  }

  @Put()
  @ApiOperation({ summary: 'Alter the nutritional decree' })
  updateGoals(@CurrentUser('id') userId: string, @Body() dto: UpdateGoalsDto) {
    return this.goalsService.updateGoals(userId, dto);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Recalculate from mortal metrics' })
  resetToCalculated(@CurrentUser('id') userId: string) {
    return this.goalsService.resetToCalculated(userId);
  }
}
