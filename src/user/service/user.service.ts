import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import { CreateProfile } from '../../profile/dtos/CreateProfile';
import { Profile } from '../../profile/entity/Profile';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUserProfile(id: number, userProfile: CreateProfile) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return undefined;
    }
    const newProfile = this.profileRepository.create(userProfile);
    user.profile = await this.profileRepository.save(newProfile);
    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
  }

  async updateUserProfile(id: number, userProfile: CreateProfile) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      return undefined;
    }
    const idProfile = user.profile.id;
    return await this.profileRepository.update(idProfile, { ...userProfile });
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }
}
