import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import { CreateProfile } from '../../profile/dtos/CreateProfile';
import { Profile } from '../../profile/entity/Profile';
import { Otp } from '../../auth/entity/Otp';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
  ) {}

  async otpChangePassword(email: string) {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const otp = {
      email: email,
      code: randomNumber,
      typeCode: 'changePassword',
    };
    await this.otpRepository.save(otp);
    setTimeout(() => {
      this.otpRepository.delete(otp);
    }, 120000);
    return randomNumber;
  }
  async sendOtpChangePassword(email: string, sub: string) {
    const otp = await this.otpChangePassword(email);
    await this.mailerService.sendMail({
      to: email,
      subject: sub,
      template: './sendOtp',
      context: {
        otp: otp,
      },
    });
  }

  async checkUserMail(id: number, email: string) {
    const user = await this.userRepository.findOneBy({ id, email });
    if (!user) {
      throw new HttpException('Không tìm thấy user', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  async checkOtpChangePass(
    email: string,
    confirmOtp: number,
    typeCode: string,
  ) {
    const otp = await this.otpRepository.findOneBy({ email, typeCode });
    if (!otp) {
      throw new HttpException('Mã xác thực hết hạn', HttpStatus.GONE);
    }
    if (otp.code == confirmOtp) {
      // await this.otpRepository.create(otp);
      await this.otpRepository.save(otp);
      return HttpStatus.OK;
    }
    throw new HttpException('Mã xác thực không đúng', HttpStatus.BAD_REQUEST);
  }

  async createUserProfile(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'Không tìm thấy người dùng',
        HttpStatus.NOT_FOUND,
      );
    }
    user.profile = await this.profileRepository.save({
      first_name: 'Guest',
      last_name: `${id}`,
      age: null,
      gender: null,
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/orderhere-b2bca.appspot.com/o/logoNK.png?alt=media&token=d4efec4a-6e8e-45d8-919b-4991cb63ac31',
    });
    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      roles: user.role,
      profile: user.profile,
    };
  }

  async updateUserProfile(id: number, userProfile: CreateProfile) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'cart'],
    });
    if (!user) {
      return undefined;
    }
    const idProfile = user.profile.id;
    await this.profileRepository.update(idProfile, { ...userProfile });
    user.profile = userProfile;
    return user;
  }

  async saveBalance(profileId: number, deposit: number) {
    const profile = await this.profileRepository.findOneBy({id: profileId})
    profile.balance = profile.balance + deposit;
    await this.profileRepository.save(profile)
    return HttpStatus.OK
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async changePassword(
    id: number,
    email: string,
    password: string,
    code: number,
    typeCode: string,
  ) {
    const otp = await this.otpRepository.findOneBy({ email, code, typeCode });
    if (!otp) {
      throw new HttpException('Phiên đổi đã hết hạn', HttpStatus.BAD_REQUEST);
    }
    await this.otpRepository.delete(otp);
    await this.userRepository.update(id, { password });
    return HttpStatus.OK;
  }
}
