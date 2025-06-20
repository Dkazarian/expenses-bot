import dotenv from 'dotenv';
import { config } from './config.js';
import TelegramBot from './telegram-bot.js';


dotenv.config();

const telegramBot = new TelegramBot(config.botToken);

telegramBot.start();

console.log('Bot started');
