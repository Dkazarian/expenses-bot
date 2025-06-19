import { User } from 'grammy/types';
import TelegramBot from '../telegram-bot.js';
import ExpensesAPI from '../api/expenses.js';

jest.mock('../api/expenses.js');

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
    (ExpensesAPI.sendExpense as jest.Mock).mockResolvedValue({
      category: 'Food',
      description: 'Pizza',
      amount: 30,
    });

    const result = await bot.processMessage(mockUser, 'Pizza 30 bucks');
    expect(result).toBe('Food expense added ✅');

    expect(ExpensesAPI.sendExpense).toHaveBeenCalledWith({
      userId: 123,
      message: 'Pizza 30 bucks',
    });
  });

  test('should log error if API responds with error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (ExpensesAPI.sendExpense as jest.Mock).mockResolvedValue({
      category: null,
      description: null,
      amount: null,
      error: {
        code: 'Error',
        message: 'Something went wrong',
      },
    });

    const result = await bot.processMessage(mockUser, 'fail message');

    expect(result).toBe('null expense added ✅');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error:',
      expect.any(Object),
      'Something went wrong'
    );

    consoleSpy.mockRestore();
  });

  test('should return undefined if API returns null', async () => {
    (ExpensesAPI.sendExpense as jest.Mock).mockResolvedValue(null);

    const result = await bot.processMessage(mockUser, 'any message');
    expect(result).toBeUndefined();
  });
});
