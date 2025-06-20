import axios from 'axios';
import BotService from '../../api/bot-service.js';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BotService', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should request errors', async () => {
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

        await BotService.sendExpense({ userId: 123, message: 'Test' });

        expect(consoleSpy).toHaveBeenCalledWith('Error', mockError);
    });
});