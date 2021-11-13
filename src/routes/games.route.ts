import { Router } from 'express';
import GamesController from '@controllers/games.controller';
import { CreateGameDto, DoMoveDto, PatchGameDto } from '@dtos/games.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class GamesRoute implements Routes {
  public path = '/games';
  public router = Router();
  public gamesController = new GamesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.gamesController.getGames);
    this.router.get(`${this.path}/highScores`, this.gamesController.getHighScores);
    this.router.get(`${this.path}/:id`, this.gamesController.getGameById);
    
    this.router.post(`${this.path}`, validationMiddleware(CreateGameDto, 'body'), this.gamesController.createGame);
    this.router.post(`${this.path}/:id/moves`, validationMiddleware(DoMoveDto, 'body'), this.gamesController.doMove);
    this.router.patch(`${this.path}/:id`, validationMiddleware(PatchGameDto, 'body'), this.gamesController.patchGame);


  }
}

export default GamesRoute;
