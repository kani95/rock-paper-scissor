import BaseException from "./BaseException";

class PlayerNotFoundException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export default PlayerNotFoundException;