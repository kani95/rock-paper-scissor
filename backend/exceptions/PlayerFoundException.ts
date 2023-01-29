import BaseException from "./BaseException";

class PlayerFoundException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}
