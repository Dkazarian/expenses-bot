import axios from 'axios';

type Error =  {
    code: 'Error' | 'NotExpense';
    message: string;
};
    
interface Response {
    category: string | null;
    description: string | null;
    amount: number | null;
    error?: Error;
}

interface Query {
    userId: number;
    message: string;
}

export default {
    async sendExpense(message: Query): Promise<Response | null> {
        try {
            return await axios.post('/api/expenses', message);
           
        } catch (error) {
            console.error('Error:', error);
            return null;            
        }
    },
};
