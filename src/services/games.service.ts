import bcrypt from 'bcrypt';
import { CreateGameDto, DoMoveDto } from '@dtos/games.dto';
import { HttpException } from '@exceptions/HttpException';
import { Game, Grid } from '@interfaces/games.interface';
import gameModel from '@models/game.model';
import { isEmpty } from '@utils/util';
import { TicTacToeLogic, Move, MoveRes } from './logic/ticTacToeLogic';
import { HighScore } from '@/interfaces/highScore.interface';

const SCORE_PER_WIN: number = 100;
const SCORE_PER_TIE: number = 10;

class GameService {

  private gameLogic = new TicTacToeLogic();

  public games = gameModel;

  public async findAllGames(): Promise<Game[]> {
    const games: Game[] = await this.games.find();
    return games;
  }

  public async getHighScores(): Promise<HighScore[]> {

    const res: any[] = await this.games.find().sort({ player1Score: -1 }).limit(10);

    const highScores: HighScore[] = res.map(x => { return { name: x.player1, score: x.player1Score } });

    return highScores;
  }

  public async findGameById(gameId: string): Promise<Game> {
    if (isEmpty(gameId)) throw new HttpException(400, "You're not gameId");

    const findGame: Game = await this.games.findOne({ _id: gameId });
    if (!findGame) throw new HttpException(409, "You're not game");

    return findGame;
  }

  public async createGame(gameData: CreateGameDto): Promise<Game> {
    if (isEmpty(gameData)) throw new HttpException(400, "You're not gameData");

    const grid: Grid = this.gameLogic.createEmptyGrid(gameData.gridSize);

    // starting a new game - player against machine
    const game: Game = await this.games.create(
      {
        player1: gameData.playerName,
        player2: "AI",
        gridSize: gameData.gridSize,
        gameLevel: gameData.gameLevel,
        turn: 1,
        grid,
        winner: 0,
        player1Score: 0,
        player2Score: 0
      });

    if (game.player2 === "AI") {
      // "tossing a coin" - if AI starts - now it makes a move
      const coinToss: boolean = Math.random() > 0.5;
      if (coinToss) {
        const move: Move = this.gameLogic.calculateBestMove(game.grid, game.gameLevel);
        const res: MoveRes = this.gameLogic.doMove({ x: move.x, y: move.y }, game.grid, 2)
        this.updateGameByMoveRes(game, res, 2);

        await this.games.findByIdAndUpdate(game._id, { ...game });
      }
    }
    return game;
  }

  public async doMove(move: DoMoveDto, gameId: string): Promise<Game> {
    if (isEmpty(move)) {
      throw new HttpException(400, "You're not move");
    }
    const game: Game = await this.games.findOne({ _id: gameId });
    if (!game) {
      throw new HttpException(404, "game not found")
    }
    if (game.isFinished) {
      throw new HttpException(403, "move not allowed after game is finished")
    }

    const res: MoveRes = this.gameLogic.doMove({ x: move.x, y: move.y }, game.grid, 1)

    if (!res.success) {
      throw new HttpException(403, "bad move")
    }

    this.updateGameByMoveRes(game, res, 1);

    if (!game.isFinished) {
      // AI's turn to play
      if (game.player2 === "AI") {
        const move: Move = this.gameLogic.calculateBestMove(game.grid, game.gameLevel);
        const res: MoveRes = this.gameLogic.doMove({ x: move.x, y: move.y }, game.grid, 2)
        this.updateGameByMoveRes(game, res, 2);
      }
    }

    await this.games.findByIdAndUpdate(gameId, { ...game });

    return game;
  }


  public async restartGame(gameId: string): Promise<Game> {

    const game: Game = await this.games.findOne({ _id: gameId });
    if (!game) {
      throw new HttpException(404, "game not found")
    }

    game.isFinished = false;
    game.turn = 1;
    game.winner = 0;
    game.grid = this.gameLogic.createEmptyGrid(game.gridSize);

    if (game.player2 === "AI") {
      const coinToss: boolean = Math.random() > 0.5;
      if (coinToss) {
        const move: Move = this.gameLogic.calculateBestMove(game.grid, game.gameLevel);
        const res: MoveRes = this.gameLogic.doMove({ x: move.x, y: move.y }, game.grid, 2)
        this.updateGameByMoveRes(game, res, 2);
      }
    }    

    await this.games.findByIdAndUpdate(gameId, { ...game });

    return game;
  }

  private updateGameByMoveRes(game: Game, res: MoveRes, player: number) {
    if (res.isWin) {
      game.winner = player;
    }
    if (res.isFull || res.isWin) {
      game.isFinished = true;
      if (game.winner == 1) {
        game.player1Score += SCORE_PER_WIN;
      }
      else if (game.winner == 2) {
        game.player2Score += SCORE_PER_WIN;
      }
      else {
        game.player1Score += SCORE_PER_TIE;
        game.player2Score += SCORE_PER_TIE;
      }
    }
  }


  public async updateGame(gameId: string, gameData: CreateGameDto): Promise<Game> {
    if (isEmpty(gameData)) throw new HttpException(400, "You're not gameData");

    const updateGameById: Game = await this.games.findByIdAndUpdate(gameId, { gameData });
    if (!updateGameById) throw new HttpException(409, "You're not game");

    return updateGameById;
  }

  public async deleteGame(gameId: string): Promise<Game> {
    const deleteGameById: Game = await this.games.findByIdAndDelete(gameId);
    if (!deleteGameById) throw new HttpException(409, "You're not game");

    return deleteGameById;
  }

}

export default GameService;
