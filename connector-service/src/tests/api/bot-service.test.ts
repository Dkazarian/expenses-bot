import axios from 'axios';
import BotService from '../../api/bot-service.js';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BotService', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the expense', async () => {
        const mockResponse = {
            data: {
                category: 'Food',
                description: 'Pizza',
                amount: 20,
            },
        };
        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await BotService.sendExpense({ telegramId: 123, message: 'Pizza 20 bucks' });

        expect(result).toEqual({
            category: 'Food',
            description: 'Pizza',
            amount: 20,
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/expenses'),
            { telegramId: 123, message: 'Pizza 20 bucks' },
            expect.objectContaining({
                headers: expect.objectContaining({
                    'X-API-Key': expect.any(String),
                    'Content-Type': 'application/json',
                }),
            })
        );
    });

    it('should handle errors', async () => {
        const mockError = {
            response: {
            data: { message: 'Something went wrong' },
            status: 404,
            message: 'Request failed with status code 404',
            name: 'AxiosError',
            code: 'ERR_BAD_REQUEST',
            },
        };
        mockedAxios.post.mockRejectedValue(mockError);

        await BotService.sendExpense({ telegramId: 123, message: 'Test' });

        expect(consoleSpy).toHaveBeenCalledWith('Error', mockError);
    });
});