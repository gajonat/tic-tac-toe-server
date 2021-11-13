import { model, Schema, Document } from 'mongoose';
import { Game } from '@interfaces/games.interface';

const gameSchema: Schema = new Schema({
  player1: {
    type: String,
    required: true,
  },
  player2: {
    type: String,
    required: true,
  },
  gridSize: {
    type: Number,
    required: true,
  },
  gameLevel: {
    type: Number,
    required: true,
  },
  turn: {
    type: Number,
    required: true,
  },
  grid: {
    type: Array,
    required: true,
  },
  isFinished: {
    type: Boolean,
    required: false
  },
  winner: {
    type: Number,
    required: false
  },
  player1Score: {
    type: Number,
    required: true,
  },
  player2Score: {
    type: Number,
    required: true,
  }
});
// index on player score in descending order, for the leader board
gameSchema.index({player1Score: 1, type: -1})


const gameModel = model<Game & Document>('Game', gameSchema);

export default gameModel;
