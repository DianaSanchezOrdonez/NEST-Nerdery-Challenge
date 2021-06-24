import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'common/enums/role.enum';


export class RoleUserDto {
  @IsNotEmpty()
  @IsEnum(Role, { message: 'role must be a MANAGER or CLIENT value' })
  role: string;
}
