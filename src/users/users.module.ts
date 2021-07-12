import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
import { CommonModule } from '../common/common.module';
import { UsersResolver } from './resolvers/user.resolver';

@Module({
  imports: [CommonModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
  // controllers: [UsersController],
})
export class UsersModule {}
