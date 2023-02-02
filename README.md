# Rock-Paper-Scissors Backend
## Description
This is a simple Rock-Paper-Scissors game backend. It is written in TypeScript and uses Koa as a web-framework.
## Installation
1. make sure you have Node.js and npm installed
2. stand in the root directory of the project
3. run following command: `cd backend && npm install`
4. run `npm run start` to start the server
5. use postman or any other tool to send requests to the server according to the API section
## Configuration
The configuration is done with [dotenv](https://www.npmjs.com/package/dotenv).
The config-class in `/server/src/config.ts` loads the .env file and makes the values available in the application or uses default values for `PORT=8000` and `PREFIX=/api/games`.
View the `.env-example` file for an example of the .env file that should be created in the root directory of the project. Note that this is not obligatory, the application will work without it.
## Testing
The testing is done with [Jest](https://jestjs.io/).
To test the project run `npm run test`
## Linting
The linter is: [TypeScript ESLint](https://typescript-eslint.io/).
To lint the project run `npm run lint` 
## API
Full url is: `http://localhost:8000/api/games/`
Request body is always in JSON format.
### POST /api/games/

#### Description
Create a new game and return the id of the game.
#### Request
```json
{
  "name": "player1"
}
```

### POST /api/games/join/:id

#### Description
Join an existing game with the given id and returns it.

#### Request
```json
{
  "name": "player2"
}
```

### POST /api/games/move/:id

#### Description
Make a move in the game with the given id and returns the game state.

#### Request
```json
{
  "name": "player1",
  "move": "rock"
}
```

### GET /api/games/:id

#### Description
Get the game state of the game with the given id.

#### Request
```json
{
  "name": "player1"
}
```
