import BaseException from "./BaseException";

class GameAlreadyExistsException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export default GameAlreadyExistsException;
