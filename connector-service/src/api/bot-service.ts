import axios, { AxiosError, isAxiosError } from 'axios';
import dotenv from 'dotenv';
import { config } from '../config.js';

dotenv.config();


interface Response {
    category: string | null;
    description: string | null;
    amount: number | null;
}

interface Query {
    userId: number;
    message: string;
}

const postWithAuthentication = async (url: string, data: Query) => {
    try {
        const response = await axios.post<Response>(`${config.botService.url}${url}`, data, {
                headers: {
                    'X-API-Key': config.botService.apiKey,
                }
            });
        return response.data;
    } catch (error: any) {
        if (isAxiosError(error)) {
                console.log('Error', { status: error.status, response: error.response });
            } else {
                console.log('Error', error);
            }
        }
        return null;
    };



export default {
    sendExpense: (message: Query): Promise<Response | null> =>  
        postWithAuthentication('/expenses', message),
};
