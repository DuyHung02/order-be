import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUser } from '../../user/dtos/CreateUser';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entity/User';
import { Repository } from 'typeorm';
import { MailerService } from '@nest-modules/mailer';
import { Otp } from '../entity/Otp';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
  ) {}

  async register(user: CreateUser) {
    const token = await this.signJwtToken(user.email, user.password);
    const newUser = await this.userRepository.create({
      ...user,
      role: 0,
    });
    await this.userRepository.save(newUser);
    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      token: token.accessToken,
    };
  }

  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return !!user;
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async changePassword(id: number, password: string) {
    return await this.userRepository.update(id, { password });
  }

  async sendOtpToMail(email: string) {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    await this.mailerService.sendMail({
      to: email,
      subject: 'welcome to my website',
      template: './sendOtp',
      context: {
        otp: randomNumber,
      },
    });
    return randomNumber;
  }

  checkOtp(otp: number, confirmOtp: number) {
    return otp == confirmOtp;
  }

  async login(email, password) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
    if (!user) {
      return undefined;
    } else {
      if (user.password == password) {
        const token = await this.signJwtToken(user.email, user.password);
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          token: token.accessToken,
          profile: user.profile,
        };
      }
      return undefined;
    }
  }

  async signJwtToken(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      email: email,
      password: password,
    };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      accessToken: jwtString,
    };
  }
}
