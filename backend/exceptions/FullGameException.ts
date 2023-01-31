import BaseException from "./BaseException";

export default class FullGameException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}
