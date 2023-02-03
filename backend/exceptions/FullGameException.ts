import BaseException from "./BaseException";

class FullGameException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export default FullGameException;
