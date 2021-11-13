import { Grid } from "@/interfaces/games.interface";


export interface MoveRes {
    success: boolean;
    error?: string;
    isWin?: boolean;
    isFull?: boolean;
}

export interface Move {
    x: number,
    y: number
}

/**
 * This class handles the grid
 * creating an empty grid, 
 * validaring moves and deploying them on the grid
 * and applying minimax algorithm to decide on "AI"'s moves
 */
export class TicTacToeLogic {

    public createEmptyGrid(size): Grid {
        const res: Grid = new Array(size);
        for (let i = 0; i < size; i++) {
            res[i] = (new Array(size)).fill(0);
        }
        return res;
    }


    public doMove(move: Move, grid: Grid, playerNum: number): MoveRes {

        const gridSize = grid.length;

        if (move.x < 0 || move.x >= gridSize) {
            return { success: false, error: `Illeagal move.x value: ${move.x}` }
        }

        if (move.y < 0 || move.y >= gridSize) {
            return { success: false, error: `Illeagal move.x value: ${move.y}` }
        }

        if (grid[move.x][move.y] > 0) {
            return { success: false, error: `Illeagal move: cell [${move.x},${move.y}] already occupied` }
        }

        grid[move.x][move.y] = playerNum;

        const isWin: boolean = this.checkWin(grid, playerNum);

        const isFull: boolean = this.checkFull(grid);

        return {
            success: true,
            error: null,
            isWin,
            isFull
        };
    }

    public calculateBestMove(grid: Grid, gameLevel: number): Move {
        const possibleMoves: Move[] = this.emptyCells(grid);

        const gridSize = grid.length;
        let depth = possibleMoves.length;
        if (gridSize > 3) {
            depth = Math.min(depth, 4)
        }

        depth = Math.min(depth, gameLevel);

        let res: any = this.minimax(grid, depth, 2);

        return res.move;
    }

    private checkWin(grid: Grid, playerNum: number): boolean {
        let countInDiagonal1: number = 0;
        let countInDiagonal2: number = 0;

        const gridSize = grid.length;

        for (let i = 0; i < gridSize; i++) {
            let countInColumn: number = 0;
            let countInRow: number = 0;
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === playerNum) {
                    countInColumn++;
                }
                if (grid[j][i] === playerNum) {
                    countInRow++;
                }
            }
            if (countInColumn === gridSize || countInRow === gridSize) {
                return true;
            }
            if (grid[i][i] === playerNum) {
                countInDiagonal1++;
            }
            if (grid[i][gridSize - i - 1] === playerNum) {
                countInDiagonal2++;
            }
        }
        if (countInDiagonal2 === gridSize || countInDiagonal1 === gridSize) {
            return true;
        }
        return false;
    }

    private checkFull(grid: Grid): boolean {
        const gridSize = grid.length;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    private gameFinished(grid: Grid) {
        return this.checkWin(grid, 1) || this.checkWin(grid, 2);
    }

    private evaluate(grid: Grid) {
        var score = 0;

        if (this.checkWin(grid, 2)) {
            score = +1;
        }
        else if (this.checkWin(grid, 1)) {
            score = -1;
        } else {
            score = 0;
        }

        return score;
    }

    private minimax(grid: Grid, depth: number, playerNum: number) {
        let best: any = { move: null }

        if (playerNum == 2) {
            best.score = -1000;
        }
        else {
            best.score = +1000;
        }

        if (depth == 0 || this.gameFinished(grid)) {
            var score = this.evaluate(grid);
            return { score: score };
        }

        const possibleMoves: Move[] = this.emptyCells(grid);
        for (let move of possibleMoves) {

            const newGrid: Grid = grid.map((arr) => {
                return arr.slice();
            });
            this.doMove(move, newGrid, playerNum);
            let res: any = this.minimax(newGrid, depth - 1, this.otherPlayer(playerNum));
            res.move = move;

            if (playerNum == 2) {
                if (res.score > best.score)
                    best = res;
            }
            else {
                if (res.score < best.score)
                    best = res;
            }
        };

        return best;
    }

    private otherPlayer(playerNum) {
        if (playerNum === 1) {
            return 2;
        }
        return 1;
    }

    private emptyCells(grid: Grid): Move[] {
        const res: Move[] = [];
        const gridSize = grid.length;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    res.push({ x: i, y: j })
                }
            }
        }
        return res;
    }
}