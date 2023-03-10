// Import Modules
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Import Interfaces
import { IAuthTokens, IResultAuthTokens } from '@modules/auth/interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request.headers?.authorization]),
            ignoreExpiration: false,
            secretOrKey: configService.get('app.SERVICE_JWT_SECRET_KEY'),
        });
    }

    async validate(payload: IAuthTokens): Promise<IResultAuthTokens> {
        return {
            userId: payload.sub,
            username: payload.username,
        };
    }
}
