import dotenv from 'dotenv';
dotenv.config();


export const env = {
    PORT : process.env.PORT || "4000",
    DB_URL : process.env.DB_URL as string,
}

