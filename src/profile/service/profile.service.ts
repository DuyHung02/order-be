import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "../entity/Profile";
import { Repository } from "typeorm";
import { User } from "../../user/entity/User";
import { UpdateProfile } from "../dtos/UpdateProfile";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>
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
    const profileId = updateProfile.id
    return this.profileRepository.update(profileId, updateProfile)
  }

  async findUserProfile(userId: number) {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"]
    });
  }
}
