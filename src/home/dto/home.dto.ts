import { PropertyType } from '@prisma/client';
import { Expose, Exclude } from 'class-transformer';

export class HomeResponseDto {
    id: number;

    @Exclude()
    realtor_id: number;
    price: number;
    address: string;
    bedrooms: number;
    bathrooms: number;
    city: string;

    @Exclude()
    land_size: number;

    @Expose({ name: 'landSize' })
    landSize() {
        return this.land_size;
    }

    @Exclude()
    property_type: PropertyType;

    @Expose({ name: 'propertyType' })
    propertyType() {
        return this.property_type;
    }

    @Exclude()
    listed_date: Date;

    @Expose({ name: 'listedDate' })
    listedDate() {
        return this.listed_date;
    }

    @Exclude()
    created_at: Date;

    @Exclude()
    updated_at: Date;

    image: string;

    constructor(partial: Partial<HomeResponseDto>){
        Object.assign(this, partial);
    }
}
