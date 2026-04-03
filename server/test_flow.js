const axios = require('axios');

const testRegFlow = async () => {
    const email = 'laughterirolewe@gmail.com'; // Using the user's SMTP email as recipient for testing
    const baseUrl = 'http://localhost:5000/api';

    try {
        console.log('1. Registering intent...');
        await axios.post(`${baseUrl}/auth/register-intent`, { email });
        console.log('Registration intent success.');

        console.log('2. Verifying payment (mock)...');
        const res = await axios.post(`${baseUrl}/auth/verify-payment`, {
            email,
            reference: 'MOCK_' + Date.now()
        });
        console.log('Verification response:', res.data);
    } catch (error) {
        console.error('Error in flow:', error.response?.data || error.message);
    }
};

testRegFlow();
