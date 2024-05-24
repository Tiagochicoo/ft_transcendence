import { Users } from "/static/js/api/index.js";
import { generateSocket, navigateTo } from "./index.js";

function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return (payload.exp < (Date.now() / 1000));
    } catch(e) {
        return false;
    }
}

function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    USER_ID = null;
}

async function refreshUserID() {
    const originalUserID = USER_ID;

    // Get the USER_ID from the 'Access Token'
    try {
        let token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (!token || isTokenExpired(token)) {
            console.log("Access token is null or expired, attempting to renew...");
            token = await renewAccessToken(refreshToken);
            if (!token) {
                throw new Error('Failed to renew access token');
            }
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        USER_ID = payload.user_id;

        const response = await Users.get(USER_ID);
        if (!response.success) {
            throw new Error('non existing user');
        }
    } catch (e) {
        clearTokens();
        return;
    }

    if (originalUserID == USER_ID) return;

    // The USER_ID changed,
    // If the USER_ID is valid regenerate the SOCKET
    if (USER_ID) {
        await generateSocket();
    }
}

async function renewAccessToken(refreshToken) {
    if (!refreshToken) {
        console.error("Refresh token is null or undefined");
        throw new Error("Refresh token is null or undefined");
    }

    console.log("Attempting to renew access token with refresh token:", refreshToken);
    try {
        const response = await fetch(`${API_URL}/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            localStorage.setItem('accessToken', jsonResponse.access);
            console.log("Access token successfully renewed.");
            return jsonResponse.access;
        } else {
            const errorText = await response.text();
            console.error('Failed to renew access token');
            throw new Error('Failed to renew access token');
        }
    } catch (error) {
    console.error('Error during token renewal:', error);
    throw error;
    }
}

async function fetchWithToken(path, options = {}) {
    let accessToken = localStorage.getItem('accessToken'),
        refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
        console.log("No tokens found, redirecting to login.");
        return navigateTo('/sign-in');
    }

    if (isTokenExpired(accessToken)) {
        console.log("Access token is expired, renewing token...");
        try {
            accessToken = await renewAccessToken(refreshToken);
        } catch (error) {
            console.error('Token renewal failed:', error);
            return navigateTo('/sign-in');
        }
    }
    
    console.log(`Making API call to ${API_URL}${path} with token: ${accessToken}`);
    try {
        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                ...options.headers,
            }
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const errorJson = await response.json();
                console.error('API call failed with JSON error:', errorJson);
            } else {
                const errorText = await response.text();
                console.error('API call failed with text error:', errorText);
            }
            throw new Error('API call failed');
        }

        const jsonResponse = await response.json();
        console.log(`Response from ${API_URL}${path}:`, jsonResponse);
        return jsonResponse;
    } catch (error) {
        console.error('Error during API call:', error);
        alert('An error occurred while communicating with the server. Please try again later.');
        throw error;
    }
}

export { clearTokens, refreshUserID, fetchWithToken };