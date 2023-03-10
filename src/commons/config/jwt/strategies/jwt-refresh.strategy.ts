// Import Modules
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Import Commons
import { ApiUnauthorizedException } from '@commons/exception/api-exception';

// Import Datasource
import { ProjectDbService } from '@datasource/project-db/project-db.service';

// Import Interfaces
import { IAuthTokens, IResultAuthTokens } from '@modules/auth/interfaces/auth.interface';
import { IGetProjectDbModels } from '@datasource/interfaces/project-db.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    private projectDbModels: IGetProjectDbModels;

    constructor(configService: ConfigService, private readonly projectDbService: ProjectDbService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request.headers?.authorization]),
            ignoreExpiration: false,
            secretOrKey: configService.get('app.SERVICE_JWT_REFRESH_SECRET_KEY'),
            passReqToCallback: true,
        });
        this.projectDbModels = this.projectDbService.getModels();
    }

    async validate(request: Request, payload: IAuthTokens): Promise<IResultAuthTokens> {
        const getUser = await this.projectDbModels.UsersModels.findOne({ where: { id: payload.sub } });
        const getRefreshToken = request.get('authorization');
        const getHashToken = getUser.hash_token;

        if (!getHashToken) {
            throw new ApiUnauthorizedException('invalid token');
        }

        return {
            userId: payload.sub,
            username: payload.username,
            refreshToken: getRefreshToken,
        };
    }
}
