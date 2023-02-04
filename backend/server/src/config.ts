import dotenv from 'dotenv';

dotenv.config();    


/* istanbul ignore next */
const config = {
    port: process.env.PORT || "" + 8000,
    endpoint: process.env.ENDPOINT || 'http://localhost:8000/api/games',
    prefix : process.env.PREFIX || '/api/games',
}

export default config;
