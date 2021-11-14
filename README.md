# tic-tac-toe-server

note: This project is accompanies by the react project [tic-tac-toe-client](https://github.com/gajonat/tic-tac-toe-client)
This readme if for both projects.

## Configuration
The project contains an ".env" file with the port. The client project contains an ".env" file with the full address of the **server** including port.
To run the server first cd to the project's folder and do 
`npm install`
then 
`npm start`
Do the same on the client folder to run the client. the default port for the client is 3000. 
A different port can be configured by setting in the package.json of the client the following (example with port 3006):
  "start": "PORT=3006 react-scripts start",
under "scripts".

### DB configuration
The server code is set to work with MongoDB (using mongoose) on localhost. It uses the default port (27017), and will create a DB named "TicTacToe".
Changes to this can be done in the files under ./src/configs

## General architecture
The general architecture is a stateless ORM based server, and single page application on the client side. The game state is saved in a "game" object, all changes immediately take effect in the DB.
For the current requirements I didn't need any other data models. 
The "Game" manages the grid, score, player names and turns. 
Requirement issue: I understood the definition of a "Game" to be the "session" in which a user stays and plays tic-tac-toe rounds, rather like an arcade game. This is because the scoring is for the entire session. 
I didn't implement user management, since it was not required, and because of the limited scope and time. A user that reconnects opens a new "Game" session.

### Front End Implementation
The "state" of the game is saved in the DB and sent to the client for presentation. All the client does is pass events such as "connect" to open a game, user clicks to initiate mopves, and "Restart" to the server. The server processes them and saves the new game state to the DB. It process the grid (including making the AI move) and returns the full recalculated game state to the client to be redrawn.
Note: I didn't use Redux on the client, the client state management is done using the top component's code. This is because it's simple enough, and because I'm new to react (I worked mainly with Vue.js and it's state managed Vuex).

## Reasoning of architectural and technical choices
The design choices were made due to the scope of the project, the requiremtns, and the required stack (nodejs + react).
A nodejs + express + mongoose based server can easily implement an efficient scalable stateless server.
An alternative would be to store the game in the server's memory (e.g. in the memory session state in ASP.NET) or in the client in some constellation, and only save to DB at the end of the game. 

### The advantages of the stateless Architecture
* The logic was required to be implemented on the server, so a possible option of managing the game on the client is not possible.
* No need to maintain a session with a specific server, in case of multiple servers. Easier salability.
* Server can restart / failover in the middle of session with no effect
* Easy to implement (not yet implemented though) re-connecting to a game the user abandoned.
* Easy to manage online activity of multiple users, no need to make sure they are using the same server (again, not yet implemented).
### Disadvantages 
* Using a session state can enable easier access to the user's data, and easier coding.
* Latency - Serving from memory can be faster than retrieving from DB. As a solutions for that we can implement a caching server, and also caching in the DB level.

### Code Layers model
The server code was written using layered model. I used [typescript-express-starter](https://www.npmjs.com/package/typescript-express-starter) boilerplate generator to create the project, since it conviniently creates these layered structure.
* router - easily implement API routes
* controller - handles API calls, shouldn't implement business logic
* service - implements the business logic
* logic code - for specific tasks such as managing the grid

Data was handled using typescript interfaces, models (for db access) and DTOs for API posted data parsing and validating.

### API 
I tried to maintain the "CRUD" guidelines when writing the API. For example, a "Move" is not a modeled data type in the DB (at this stage) but I am using a "POST" call to create a move, at /game/<game-id>/moves.

## Trade offs
* As stated above, I didn't manage users. It allowed me to focus on managing a "game".
* I didn't get to implement a "multiplayer" game. I tried to keep the logic ready for that, and treat "AI" as just a user with special cases. Still, it 
involves handling the "waiting for other user" stage both on client and on server.
* I did implement a persistence layer. All the game is managed there + leader board is queried from there (with a designated index).
* I did implement a "smart" algorithm, using a "minimax" I implemented using some example client side js code... I also enabled the user to choose the level of AI (controlling the depth of the calculation), at connection time.
* I coded the logic using a flexible parameter for the size for the grid, so I was able to easily add my own feature - at connection the user can choose the grid size (I allow 3,4, and 5)






