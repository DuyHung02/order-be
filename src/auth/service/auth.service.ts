import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CreateUser } from "../../user/dtos/CreateUser";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/entity/User";
import { Repository } from "typeorm";
import { MailerService } from "@nest-modules/mailer";
import { Otp } from "../entity/Otp";
import { comparePassword, encodePassword } from "../utils/bcrypt";
import { Role } from "../../entity/Role";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
  ) {}

  async register(user: CreateUser) {
    const role = 'user'
    const password = await encodePassword(user.password);
    const newUser = await this.userRepository.save({
      ...user,
      password: password,
      role: role,
    });
    return {
      ...newUser,
      token: await this.signJwtToken(newUser.id, newUser.email, role)
    };
  }

  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new HttpException('Tài khoản đã tồn tại', HttpStatus.BAD_REQUEST);
    }
    return false;
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findUserById(id: number) {
    return this.userRepository.findOneBy({ id })
  }

  async otpRegister(email: string) {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const otp = {
      email: email,
      code: randomNumber,
      typeCode: 'register',
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
      template: './sendOtp',
      context: {
        otp: otp,
      },
    });
  }

  async checkOtp(email: string, confirmOtp: number, typeCode: string) {
    const otp = await this.otpRepository.findOneBy({ email, typeCode });
    if (!otp) {
      throw new HttpException('Mã xác thực hết hạn', HttpStatus.GONE);
    }
    if (otp.code == confirmOtp) {
      await this.otpRepository.delete(otp);
      return HttpStatus.OK;
    }
    throw new HttpException('Mã xác thực không đúng', HttpStatus.BAD_REQUEST);
  }

  async login(email, password) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['profile', 'cart'],
    });
    if (!user) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }
    const matched = comparePassword(password, user.password);
    if (matched) {
      return {
        ...user,
        token: await this.signJwtToken(user.id, user.email, user.role)
      };
    } else {
      throw new HttpException('Mật khẩu không đúng', HttpStatus.BAD_REQUEST);
    }
  }

  async signJwtToken(
    id: number,
    email: string,
    role: string
  ) {
    const payload = {
      id: id,
      email: email,
      role: role
    };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: this.configService.get('JWT_SECRET'),
    })
  }
}
