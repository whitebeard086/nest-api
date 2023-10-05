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

interface CreateHomeParams {
    address: string;
    bedrooms: number;
    bathrooms: number;
    city: string;
    price: number;
    landSize: number;
    propertyType: PropertyType;
    images: { url: string }[];
}

const homeSelect = {
    id: true,
    address: true,
    city: true,
    price: true,
    property_type: true,
    bedrooms: true,
    bathrooms: true,
};

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
            throw new NotFoundException();
        }

        return homes.map((home) => {
            const returnedHomes = { ...home, image: home.images[0].url };
            delete returnedHomes.images;
            return new HomeResponseDto(returnedHomes);
        });
    }

    async getHomeById(id: number): Promise<HomeResponseDto> {
        const home = await this.prismaService.home.findUnique({
            where: {
                id,
            },
            select: {
                ...homeSelect,
                images: {
                    select: {
                        url: true,
                    },
                },
                realtor: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        if (!home) {
            throw new NotFoundException('Home not found');
        }

        return new HomeResponseDto(home);
    }

    async createHome({
        address,
        bathrooms,
        bedrooms,
        city,
        landSize,
        price,
        propertyType,
        images,
    }: CreateHomeParams) {
        const home = await this.prismaService.home.create({
            data: {
                address,
                bathrooms,
                bedrooms,
                city,
                price,
                land_size: landSize,
                property_type: propertyType,
                realtor_id: 1,
            },
        });

        const homeImages = images.map((image) => {
            return { ...image, home_id: home.id };
        });

        await this.prismaService.image.createMany({ data: homeImages });

        return new HomeResponseDto(home);
    }
}
