import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class SearchParams {
  @Min(1)
  qty: number;
}
