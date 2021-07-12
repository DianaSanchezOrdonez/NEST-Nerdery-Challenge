/* eslint-disable prettier/prettier */
import {
  Resolver,
  Query,
  Args,
  Mutation,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import {
    Body,
    Controller,
    Get,
    Param,
    UseGuards,
    Patch,
    Request,
  } from '@nestjs/common';
  import { Roles } from '../../common/decorators/roles.decorator';
  import { Role } from '../../common/enums/role.enum';
  import { UsersService } from './../users.service';
  import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
  import { UpdateInfoDto } from './../dto/update-user.dto';
  import { RolesGuard } from '../../common/guards/roles.guard';
  import { RoleUserDto } from './../dto/role-user.dto';
  import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
  import { BaseUser} from '../models/user.model'

  @ApiTags('Users')
  @Resolver(() => BaseUser)
  export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}
  
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth('access_token')
    // @Patch('account')
    // async update(@Request() req): Promise<UpdateInfoDto> {
    //   return this.usersService.updateUser(req.user.id, { ...req.body });
    // }
  
    



    // @Roles(Role.MANAGER)
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiOperation({ summary: 'Only MANAGER access' })
    // @ApiBearerAuth('access_token')
    // @Get()
    @Query(() => [BaseUser])
    getUsers(){
      return this.usersService.getUsers();
    }
  
    // @Roles(Role.MANAGER)
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiOperation({ summary: 'Only MANAGER access' })
    // @ApiBearerAuth('access_token')
    // @Patch('/:idUser/role')
    // updateRole(@Param('idUser') idUser: string, @Body() role: RoleUserDto) {
    //   return this.usersService.updateRole(idUser, role);
    // }
  }
  