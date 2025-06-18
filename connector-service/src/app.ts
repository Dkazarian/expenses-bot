import { config } from './config.js';
import { Bot, Context } from 'grammy';



const bot = new Bot(config.botToken);


bot.on("message:text", (ctx: Context) => ctx?.message && ctx.reply("Echo: " + ctx.message.text));


bot.start();
