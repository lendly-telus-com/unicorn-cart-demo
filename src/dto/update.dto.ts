import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  sku: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  qty: number;
}
