import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
    console.log("Error loading .env file\nUsing default configuration");
}

const config = {
    port: process.env.PORT || 8000,
    endpoint: process.env.ENDPOINT || 'http://localhost:8000/api/games',
    prefix : process.env.PREFIX || '/api/games',
}

export default config;
