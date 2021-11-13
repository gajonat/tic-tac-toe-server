import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateGameDto {
  @IsString()
  public playerName: string;

  @IsNumber()
  public gridSize: number;

  @IsNumber()
  public gameLevel: number;
}


export class PatchGameDto {
  @IsBoolean()
  public isFinished: boolean;
}


export class DoMoveDto {

  @IsNumber()
  public x: number;

  @IsNumber()
  public y: number;
}
