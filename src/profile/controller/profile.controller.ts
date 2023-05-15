import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { ProfileService } from "../service/profile.service";
import { UpdateProfile } from "../dtos/UpdateProfile";

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {
  }

  @Post('create')
  createProfile(@Request() req) {
    const userId = req.user.id
    return this.profileService.createProfile(userId)
  }

  @Post('update')
  updateProfile(@Body() updateProfile: UpdateProfile) {
    return this.profileService.updateUserProfile(updateProfile)
  }

  @Get('find')
  findUserProfile(@Request() req) {
    const userId = req.user.id
    return this.profileService.findUserProfile(userId)
  }
}
