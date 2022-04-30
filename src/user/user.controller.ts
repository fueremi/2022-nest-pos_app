import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTGuard } from '../auth/guard';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //#region //? Create User
  @Post()
  create(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }
  //#endregion
  //#region //? Find All Users
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  //#endregion
  //#region //? Find User By Id
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.findById(userId);
  }
  //#endregion
  //#region //? Update User By Id
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() body: UpdateUserDTO,
  ) {
    return this.userService.update(userId, body);
  }
  //#endregion
  //#region //? Delete User By Id
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.delete(userId);
  }
  //#endregion
}
