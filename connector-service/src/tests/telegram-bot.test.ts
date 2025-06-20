import { User } from 'grammy/types';
import TelegramBot from '../telegram-bot.js';
import BotService from '../api/bot-service.js';

jest.mock('../api/bot-service.js');

describe('TelegramBot', () => {
  let bot: TelegramBot;
  const mockUser: User = {
    id: 123,
    is_bot: false,
    first_name: 'Test User',
  };

  beforeEach(() => {
    bot = new TelegramBot('123');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return success message when API responds with category', async () => {
    (BotService.sendExpense as jest.Mock).mockResolvedValue({
      category: 'Food',
      description: 'Pizza',
      amount: 30,
    });

    const result = await bot.processMessage(mockUser, 'Pizza 30 bucks');
    expect(result).toBe('Food expense added ✅');

    expect(BotService.sendExpense).toHaveBeenCalledWith({
      userId: 123,
      message: 'Pizza 30 bucks',
    });
  });

  
  test('should return undefined if API returns null', async () => {
    (BotService.sendExpense as jest.Mock).mockResolvedValue(null);

    const result = await bot.processMessage(mockUser, 'any message');
    expect(result).toBeUndefined();
  });
});
