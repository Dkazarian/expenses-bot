import { Bot, Context, } from 'grammy';
import BotService from './api/bot-service.js';
import { User } from 'grammy/types';

class TelegramBot {
    private bot: Bot;
    constructor(token: string) {
        this.bot = new Bot(token);
        this.bot.on("message:text", async (ctx: Context) => {
            if (ctx.hasCommand("start")) {
                return ctx.reply("Hello! Use me to track your expenses 💸");
            }
            if (!ctx.message || !ctx.from || !ctx.message.text) return;

            const result = await this.processMessage(ctx.from, ctx.message.text);

            if (result) {
                return ctx.reply(result);
            }
        });

    }

    start() {
        this.bot.start();
    }

    async processMessage(from: User, message: string) {
        const res = await BotService.sendExpense({
            userId: from.id,
            message: message,
        });

        // The telegram bot will only answer if the BotService recorded an expense
        if (res) {
            return `${res.category} expense added ✅`;
        }
    }
};

export default TelegramBot;
