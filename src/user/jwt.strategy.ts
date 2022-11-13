import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from './user.service';
@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private readonly logger: Logger,) {
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;
    this.logger.log(payload.email);
    const user = await this.userService.findOne(email);
    this.logger.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
