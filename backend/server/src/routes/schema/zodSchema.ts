import zod from 'zod';
import { Move } from '../../../../db/model/Player';

const playerSchema = zod.object({
    name: zod.string().min(1).max(50)
});

const moveSchema = zod.object({
    name: zod.string().min(1).max(50),
    move: zod.enum([Move.ROCK, Move.PAPER, Move.SCISSORS]).transform((value) => value.toLowerCase())
});

const idSchema = zod.object({
    id: zod.string().min(1).max(70)
});

export { playerSchema, moveSchema, idSchema };