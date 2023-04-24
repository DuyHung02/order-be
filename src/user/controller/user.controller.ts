import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateProfile } from '../../profile/dtos/CreateProfile';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id/profile')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateProfile,
  ) {
    return this.userService.createUserProfile(id, profile);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/profile/update')
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateProfile,
  ) {
    return this.userService.updateUserProfile(id, profile);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('find/user/:id')
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }
}
