import { fetchWithToken } from '../services/authService.js';

document.addEventListener("DOMContentLoaded", function() {
    whoamiRequest();
});

async function whoamiRequest() {
    try {
        const response = await fetchWithToken('http://localhost:8000/api/whoami/');
        console.log('Test response:', response);
    } catch (error) {
        console.error('Error fetching whoami:', error);
    }
}