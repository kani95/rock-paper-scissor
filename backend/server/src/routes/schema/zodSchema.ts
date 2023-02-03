import zod from 'zod';
import Move from '../../../../db/model/Move';

// schemas used by the routes to check the request body

// schema for the player sent in the request body
const playerSchema = zod.object({
    name: zod.string().min(1).max(50)
});

// schema for the move sent in the request body
const moveSchema = zod.object({
    name: zod.string().min(1).max(50),
    move: zod.string().transform((value) => value.toLowerCase()).refine((value) => {
        return value === Move.ROCK || value === Move.PAPER || value === Move.SCISSORS;
    })      
});

// schema for the id sent in the request body
const idSchema = zod.object({
    id: zod.string().min(1).max(70)
});

export { playerSchema, moveSchema, idSchema };
