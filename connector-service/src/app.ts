import dotenv from 'dotenv';
import { config } from './config.js';
import { createTelegramBot } from './bot.js';

dotenv.config();

const telegramBot = createTelegramBot(config.botToken);

telegramBot.start();