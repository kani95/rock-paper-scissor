import BaseException from "./BaseException";

class GameEndedException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}