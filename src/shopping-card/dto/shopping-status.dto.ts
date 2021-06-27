import { Status } from '../../common/enums/status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ShoppingStatus {
  @IsNotEmpty()
  @IsEnum(Status, {
    message: 'role must be a CANCELLED, PENDING or PAID value',
  })
  status: string;
}
