# tic-tac-toe-server

note: This project is accompanies by the react project [tic-tac-toe-client](https://github.com/gajonat/tic-tac-toe-client)

### Configuration
Both project contain an ".env" file with the port of the server.
The client can be run using "npm start" on the default port (3000). 
A different port can be configured by setting in the package.json of the client the following (example with port 3006):
  "start": "PORT=3006 react-scripts start",
under "scripts"

### DB configuration
The server code is set to work with MongoDB (using mongoose) on localhost. It uses the default port (27017), and will create a DB named "TicTacToe".
Changes to this can be done in the files under ./src/configs

## General architecture
The general architecture is a stateless ORM based processing. All changes are immediatetly saved in a "game" object. 
For the current requirements I didn't need mode data models. 
A "Game" manages the grid, score, turns. I understand the definition of a "Game" to be the "session" in which a user stays and plays, rather like an arcade game. 
Since it was not required, and because of the limited scope and time, I didn't implement persistent user management, and a user that will connect again is regarded as a different user.

The "state" of the game is saved in the DB and sent to the client for presentation. All the client does is pass the clicks of the user to the service, which saves them 
to the DB, process the grid (including making the AI move) and returns the recalculated grid to the client to be redrawn.


## Reasoning of technical choices
The technical choices were made due to the scope of the project, the requiremtns, and the given stack (nodejs + react).
An alternative would be to store the game in the server's memory and in the client in some constellation, and only save to DB at the end of the game.

### The advantages of the stateless Architecture
* The logif needed to be done in the server anyway, so a possible option of managing the game on the client is not possible.
* No need to maintain a session with a specific server, in case of multiple servers. Easier salability.
* server can restart / failover in the middle of session with no effect
* easy to implement (not yet implemented though) re-connecting to a game the user abandoned.
* easy to manage online activity of multiple users, no need to make sure they are using the same server.
### Disadvantages 
* Using a session state can enable easier access to the user's data, and easier coding
* Serving from memory can be faster than retrieving from DB. As a solutions for that we can implement a caching server, and also caching in the DB level.

### Code Layers model
The code is written using layered model. I used [typescript-express-starter](https://www.npmjs.com/package/typescript-express-starter) boilerplate generator to
create the project, and it's conviniently created with these layers implemented
* router - easily implement API hooks
* controller - handles API calls, shouldn't implement business logic
* service - implements the business logic
* logic code - for specific tasks such as managing the grid

Data was handled using typescript interfaces, models (for db access) and DTOs for API posted data parsing and validating.

### API 
I tried to maintain the "CRUD" guidelines when writing the API. a "Move" is not a data modeled in the DB (at this stage) but I am using "POST" of a 
move to /game/xyz/moves to send a move the server, and not an "action" call.

## Trade offs
* As stated above, I didn't manage users. It allowed me to focus on managing a "game".
* I didn't get to implement a "multiplayer" game. I tried to keep the logic ready for that, and treat "AI" as just a user with special cases. Still, it 
involves handling the "waiting for other user" stage both on client and on server.
* I did implement a persistence layer. All the game is managed there + leader board.
* I did implement minimax "smart" algorithm. I also enabled the user to choose the level of AI (controlling the depth of the calculation).
* I didn't code the logic using a "hard" size for the grid, so I was able to easily add a featre - at connection the user can choose the grid size (I allow 3,4, and 5)






