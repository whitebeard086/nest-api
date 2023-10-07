import {
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Body,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) {}

    @Get()
    getHomes(
        @Query('city') city?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('property_type') property_type?: PropertyType,
    ): Promise<HomeResponseDto[]> {
        const price =
            minPrice || maxPrice
                ? {
                      ...(minPrice && { gte: parseFloat(minPrice) }),
                      ...(maxPrice && { lte: parseFloat(maxPrice) }),
                  }
                : undefined;

        const filters = {
            ...(city && { city }),
            ...(price && { price }),
            ...(property_type && { property_type }),
        };
        return this.homeService.getHomes(filters);
    }

    @Get(':id')
    getHome(@Param('id', ParseIntPipe) id: number) {
        return this.homeService.getHomeById(id);
    }

    @Post()
    createHome(@Body() body: CreateHomeDto) {
        return this.homeService.createHome(body);
    }

    @Put(':id')
    updateHome(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateHomeDto
    ) {
        return this.homeService.updateHomeById(id, body);
    }

    @Delete(':id')
    deleteHome(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.homeService.deleteHomeById(id);
    }
}
