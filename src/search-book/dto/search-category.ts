import { IsNotEmpty, IsString } from "class-validator";

export class SearchCategory {
  @IsNotEmpty()
  @IsString()
  search: string;
}
