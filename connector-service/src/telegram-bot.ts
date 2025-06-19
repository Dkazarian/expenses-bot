import { Bot, Context, } from 'grammy';
import ExpensesAPI from './api/expenses.js';
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
            const reply = await this.processMessage(ctx.from, ctx.message.text);
            if (reply) {
                return ctx.reply(reply);
            }
        });

    }

    start() {
        this.bot.start();
    }

    async processMessage(from: User, message: string) {
        const res = await ExpensesAPI.sendExpense({
            userId: from.id,
            message: message,
        });
        if (res) {
            if (res.error) {
                console.error("Error:", res.error, res.error.message);
            }
            return `${res.category} expense added ✅`;
        }
    }
};

export default TelegramBot;
