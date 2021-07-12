/* eslint-disable prettier/prettier */
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role, RoleType } from '../../common/enums/role.enum';
@ObjectType()
export class BaseUser {
  @Field(() => Int)
  readonly id: number;

  @Field({ nullable: true })
  readonly firstName?: string;

  @Field({ nullable: true })
  readonly lastName?: string;

  @Field()
  readonly email: string;

  @Field()
  readonly password: string;

  @Field()
  readonly emailVerified: boolean;

  @Field()
  readonly userName: string;

  @Field(() => Role)
  readonly role: RoleType;

  @Field()
  readonly hashActivation: string;

  @Field()
  readonly active: boolean;
}
