import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CreateUser } from "../../user/dtos/CreateUser";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/entity/User";
import { Repository } from "typeorm";
import { MailerService } from "@nest-modules/mailer";
import { Otp } from "../entity/Otp";
import { comparePassword, encodePassword } from "../utils/bcrypt";
import { jwtConstants } from "../auth.constants";
import { Role } from "../../user/entity/Role";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    @InjectRepository(Role) private roleRepository: Repository<Role>
  ) {
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    const matched = comparePassword(pass, user.password);
    if (!matched) {
      throw new UnauthorizedException("Sai mật khẩu");
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret
        , expiresIn: "1h"
      })
    };
  }

  async register(email: string, password: string) {
    const hasPassword = await encodePassword(password);
    const newUser = await this.userRepository.save({
      email: email,
      password: hasPassword,
    });
    await this.roleRepository.save({
      name: 'user',
      user: newUser,
    })
    const payload = {email: newUser.email, sub: newUser.id}
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1h'
      })
    }
  }

  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email: email });
    if (user) {
      throw new HttpException("Tài khoản đã tồn tại", HttpStatus.BAD_REQUEST);
    }
    return false;
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async otpRegister(email: string) {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const otp = {
      email: email,
      code: randomNumber,
      typeCode: "register"
    };
    await this.otpRepository.save(otp);
    setTimeout(() => {
      this.otpRepository.delete(otp);
    }, 60000);
    return randomNumber;
  }

  async sendOtpRegister(email: string, sub: string) {
    const otp = await this.otpRegister(email);
    await this.mailerService.sendMail({
      to: email,
      subject: sub,
      template: "./sendOtp",
      context: {
        otp: otp
      }
    });
  }

  async checkOtp(email: string, confirmOtp: number, typeCode: string) {
    const otp = await this.otpRepository.findOneBy({ email, typeCode });
    if (!otp) {
      throw new HttpException("Mã xác thực hết hạn", HttpStatus.GONE);
    }
    if (otp.code == confirmOtp) {
      await this.otpRepository.delete(otp);
      return HttpStatus.OK;
    }
    throw new HttpException("Mã xác thực không đúng", HttpStatus.BAD_REQUEST);
  }
}
