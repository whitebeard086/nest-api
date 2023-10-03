import { PropertyType } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

interface GetHomesQueryParams {
    city?: string;
    price?: {
        gte?: number;
        lte?: number;
    };
    property_type: PropertyType;
}

@Injectable()
export class HomeService {
    constructor(private readonly prismaService: PrismaService) {}

    async getHomes(filter: GetHomesQueryParams): Promise<HomeResponseDto[]> {
        const homes = await this.prismaService.home.findMany({
            select: {
                id: true,
                price: true,
                address: true,
                bedrooms: true,
                bathrooms: true,
                city: true,
                land_size: true,
                property_type: true,
                listed_date: true,
                images: {
                    select: {
                        url: true,
                    },
                    take: 1,
                },
            },
            where: filter,
        });

        if (!homes.length) {
            throw new NotFoundException()
        }

        return homes.map((home) => {
            const returnedHomes = { ...home, image: home.images[0].url };
            delete returnedHomes.images;
            return new HomeResponseDto(returnedHomes);
        });
    }
}
