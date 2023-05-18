import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "../entity/Profile";
import { Repository } from "typeorm";
import { User } from "../../user/entity/User";
import { UpdateProfile } from "../dtos/UpdateProfile";
import { Otp } from "../../auth/entity/Otp";
import { MailerService } from "@nest-modules/mailer";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private mailerService: MailerService
  ) {
  }

  async createProfile(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException("Không tìm thấy người dùng", HttpStatus.BAD_REQUEST);
    }
    user.profile = await this.profileRepository.save({
      first_name: "Guest",
      last_name: `${userId}`,
      age: null,
      gender: null,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/orderhere-b2bca.appspot.com/o/logoNK.png?alt=media&token=d4efec4a-6e8e-45d8-919b-4991cb63ac31"
    });
    await this.userRepository.save(user);
    return HttpStatus.OK;
  }

  async updateUserProfile(updateProfile: UpdateProfile) {
    const profileId = updateProfile.id;
    await this.profileRepository.update(profileId, updateProfile);
    return await this.profileRepository.findOneBy({ id: profileId });
  }

  async findUserProfile(userId: number) {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"]
    });
  }

  async otpDeposit(email: string) {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const otp = {
      email: email,
      code: randomNumber,
      typeCode: "deposit"
    };
    await this.otpRepository.save(otp);
    setTimeout(() => {
      this.otpRepository.delete(otp);
    }, 60000);
    return randomNumber;
  }

  async sendOtpDeposit(email: string, sub: string) {
    const otp = await this.otpDeposit(email);
    await this.mailerService.sendMail({
      to: email,
      subject: sub,
      template: "./sendOtp",
      context: {
        otp: otp
      }
    });
  }

  async checkOtpDeposit(email: string, confirmOtp: number, typeCode: string) {
    const otp = await this.otpRepository.findOneBy({ email, typeCode });
    if (!otp) {
      throw new HttpException("Mã xác thực hết hạn", HttpStatus.BAD_REQUEST);
    }
    if (otp.code == confirmOtp) {
      await this.otpRepository.delete(otp);
      return HttpStatus.OK;
    }
    throw new HttpException("Mã xác thực không đúng", HttpStatus.BAD_REQUEST);
  }

  async saveBalance(userId: number, deposit: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"]
    });
    if (!user) {
      throw new HttpException('Không tìm thấy người dùng', HttpStatus.BAD_REQUEST)
    }
    const profile = user.profile;
    profile.balance = profile.balance + deposit;
    await this.profileRepository.save(profile);
    return HttpStatus.OK;
  }
}
