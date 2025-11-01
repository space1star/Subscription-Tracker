/* eslint-disable no-undef */
// /* eslint-disable no-undef */
import { config } from 'dotenv';

//config({ path: '.env' });//this'll extract all the env. var.
//need multiple env var files for more environments

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });//by deafault it set to development

export const { 
    PORT, NODE_ENV, SERVER_URL,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_ENV, ARCJET_KEY,
    QSTASH_URL, QSTASH_TOKEN,
    EMAIL_PASSWORD,
} = process.env;