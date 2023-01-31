import BaseException from "./BaseException";

class InvalidMoveException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export default InvalidMoveException;
