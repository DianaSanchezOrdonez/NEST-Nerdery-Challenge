import {
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  Patch,
  Request,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateInfoDto } from './dto/update-user.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleUserDto } from './dto/role-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Patch('account')
  async update(@Request() req): Promise<UpdateInfoDto> {
    return this.usersService.updateUser(req.user.id, { ...req.body });
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Patch('/:idUser/role')
  updateRole(@Param('idUser') idUser: string, @Body() role: RoleUserDto) {
    return this.usersService.updateRole(idUser, role);
  }
}
