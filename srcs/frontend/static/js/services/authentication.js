import { Users } from "/static/js/api/index.js";
import { generateSocket, navigateTo } from "./index.js";

function doLogout() {
    SOCKET.disconnect();
    clearTokens();
    navigateTo('/sign-in');
}

function getCSRFToken() {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; csrftoken=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : '';
    } catch(e) {
        return null;
    }
}

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

function getUserIDfromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id;
    } catch(e) {
        return null;
    }
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
        USER_ID = getUserIDfromToken(token);

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
        console.log("Refresh token is null or undefined");
        return null;
    }

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
            throw new Error('Failed to renew access token');
        }
    } catch (error) {
        console.error('Error during token renewal:', error);
        return null;
    }
}

async function fetchWithToken(path, options = {}) {
    let accessToken = localStorage.getItem('accessToken'),
        refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
        console.log("No tokens found, redirecting to login.");
        return doLogout();
    }

    if (isTokenExpired(accessToken)) {
        console.log("Access token is expired, renewing token...");
        accessToken = await renewAccessToken(refreshToken);
        if (!accessToken) {
            return doLogout();
        }
    }
    
    try {
        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-access-token": accessToken,
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

        return await response.json();
    } catch (error) {
        console.error('Error during API call:', error);
    }
}

export { doLogout, getCSRFToken, getUserIDfromToken, clearTokens, refreshUserID, fetchWithToken };
