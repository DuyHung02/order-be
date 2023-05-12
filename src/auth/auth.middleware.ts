import { Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService, private config: ConfigService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, this.config.get('JWT_SECRET')) as { id: number, email: string, role: string }
    const user = await this.authService.findUserById(decodedToken.id)
    req.user = user
    next()
  }
}