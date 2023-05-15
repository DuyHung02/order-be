import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./auth.constants";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./auth.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entity/User";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector,
              @InjectRepository(User) private userRepository: Repository<User>) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Vui lòng đăng nhập");
    }
    try {
      request["user"] = await this.jwtService.verifyAsync(
        token, { secret: jwtConstants.secret }
      );
      const userId = request.user.sub
      request.user = await this.userRepository.findOne({
        where: { id: userId},
        relations: ["roles"]
      });
    } catch {
      throw new UnauthorizedException("Phiên đăng nhập hết hạn");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}