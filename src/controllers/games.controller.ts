import { NextFunction, Request, Response } from 'express';
import { CreateGameDto, DoMoveDto, PatchGameDto } from '@dtos/games.dto';
import { Game } from '@interfaces/games.interface';
import GameService from '@services/games.service';

class GamesController {
  public gameService = new GameService();

  public getGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllGamesData: Game[] = await this.gameService.findAllGame();

      res.status(200).json({ data: findAllGamesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getHighScores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllGamesData: Game[] = await this.gameService.getHighScores();

      res.status(200).json({ data: findAllGamesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getGameById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const findOneGameData: Game = await this.gameService.findGameById(gameId);

      res.status(200).json({ data: findOneGameData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameData: CreateGameDto = req.body;
      const createGameData: Game = await this.gameService.createGame(gameData);

      res.status(201).json({ data: createGameData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public doMove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;

      const move: DoMoveDto = req.body;
      const gameData: Game = await this.gameService.doMove(move, gameId);

      res.status(201).json({ data: gameData, message: 'moved' });
    } catch (error) {
      next(error);
    }
  };

  public patchGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const gameData: PatchGameDto = req.body;
      
      if (gameData.isFinished === false){
        const updateGameData: Game = await this.gameService.restartGame(gameId);
        res.status(200).json({ data: updateGameData, message: 'updated' });        
      }

    } catch (error) {
      next(error);
    }
  };

  public updateGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const gameData: CreateGameDto = req.body;
      const updateGameData: Game = await this.gameService.updateGame(gameId, gameData);

      res.status(200).json({ data: updateGameData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const deleteGameData: Game = await this.gameService.deleteGame(gameId);

      res.status(200).json({ data: deleteGameData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default GamesController;
