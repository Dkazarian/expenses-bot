import dotenv from 'dotenv';
import { config } from './config.js';
import { Bot, Context } from 'grammy';
import ExpensesAPI from './api/expenses.js';

dotenv.config();

export const createTelegramBot = (token: string) => {
    const bot = new Bot(config.botToken);

    bot.on("message:text", async (ctx: Context) => {
        if (!ctx.message) return;

        if (ctx.hasCommand("start")) {
            return ctx.reply("Hello! Use me to track your expenses.");
        } else if(!!ctx.message.text && !!ctx.from) {
            const res = await ExpensesAPI.sendExpense({
                userId: ctx.from.id,
                message: ctx.message.text,
            });
            if (res) {
                if (res.error) {
                    console.error("Error:", res.error, res.error.message);
                }
                return ctx.reply(`${res.category} expense added ✅`);
            }
        }
    });
    return bot;
};