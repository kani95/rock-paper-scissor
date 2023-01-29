import BaseException from "./BaseException";

class GameNotFoundException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}