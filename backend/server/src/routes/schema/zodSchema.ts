import zod from 'zod';
import Move from '../../../../db/model/Move';

// schemas for the routes

// schema for the player sent in the request body
const playerSchema = zod.object({
    name: zod.string().min(1).max(50)
});

// schema for the move sent in the request body
const moveSchema = zod.object({
    name: zod.string().min(1).max(50),
    move: zod.enum([Move.ROCK, Move.PAPER, Move.SCISSORS])
            .transform((value) => value.toLowerCase())
});

// schema for the id sent in the request body
const idSchema = zod.object({
    id: zod.string().min(1).max(70)
});

export { playerSchema, moveSchema, idSchema };
