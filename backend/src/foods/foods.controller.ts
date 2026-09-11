import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FoodsService } from './foods.service';
import { SearchFoodDto, CreateCustomFoodDto } from './dto/search-food.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('foods')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search foods' })
  search(@Query() dto: SearchFoodDto, @CurrentUser('id') userId: string) {
    return this.foodsService.search(dto, userId);
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Look up a food by barcode' })
  searchByBarcode(@Param('barcode') barcode: string, @CurrentUser('id') userId: string) {
    return this.foodsService.searchByBarcode(barcode, userId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get favorite foods' })
  getFavorites(@CurrentUser('id') userId: string) {
    return this.foodsService.getFavorites(userId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recently logged foods' })
  getRecentFoods(@CurrentUser('id') userId: string) {
    return this.foodsService.getRecentFoods(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a food by id' })
  getFoodById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.foodsService.getFoodById(id, userId);
  }

  @Post('custom')
  @ApiOperation({ summary: 'Create a custom food' })
  createCustomFood(@CurrentUser('id') userId: string, @Body() dto: CreateCustomFoodDto) {
    return this.foodsService.createCustomFood(userId, dto);
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Toggle favorite status for a food' })
  toggleFavorite(@Param('id') foodId: string, @CurrentUser('id') userId: string) {
    return this.foodsService.toggleFavorite(userId, foodId);
  }
}
