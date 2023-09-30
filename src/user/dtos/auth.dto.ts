import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
    Matches,
} from 'class-validator';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @Matches(/(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}(?!\d)/, {
        message: 'phone must be a valid phone number',
    })
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    password: string;
}
