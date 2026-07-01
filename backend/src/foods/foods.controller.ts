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
  @ApiOperation({ summary: 'Search the tome of sustenance' })
  search(@Query() dto: SearchFoodDto, @CurrentUser('id') userId: string) {
    return this.foodsService.search(dto, userId);
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Decipher the cursed barcode' })
  searchByBarcode(@Param('barcode') barcode: string, @CurrentUser('id') userId: string) {
    return this.foodsService.searchByBarcode(barcode, userId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'View the sacred tome of favorites' })
  getFavorites(@CurrentUser('id') userId: string) {
    return this.foodsService.getFavorites(userId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Recent cursed consumptions' })
  getRecentFoods(@CurrentUser('id') userId: string) {
    return this.foodsService.getRecentFoods(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Inspect a morsel of sustenance' })
  getFoodById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.foodsService.getFoodById(id, userId);
  }

  @Post('custom')
  @ApiOperation({ summary: 'Forge a custom food from the void' })
  createCustomFood(@CurrentUser('id') userId: string, @Body() dto: CreateCustomFoodDto) {
    return this.foodsService.createCustomFood(userId, dto);
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Mark as accursed favorite' })
  toggleFavorite(@Param('id') foodId: string, @CurrentUser('id') userId: string) {
    return this.foodsService.toggleFavorite(userId, foodId);
  }
}
