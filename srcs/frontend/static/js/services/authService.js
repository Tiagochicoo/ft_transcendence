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
}

async function refreshUserID() {
    const originalUserID = USER_ID;

    // Get the USER_ID from the 'Access Token'
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('no accessToken');
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        USER_ID = isTokenExpired(token) ? null : payload.user_id;

        const response = await Users.get(USER_ID);
        if (!response.success) {
            throw new Error('non existing user');
        }
    } catch (e) {
        clearTokens();
        USER_ID = null;
    }

    if (originalUserID == USER_ID) return;

    // The USER_ID changed,
    // If the USER_ID is valid regenerate the SOCKET
    if (USER_ID) {
        await generateSocket();
    }
}

function getUserIDFromToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.log("No token found, user not logged in.");
        return null;
    }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id;
    } catch(e) {
        console.error("Invalid token: ", e);
        return null;
    }
}


async function renewAccessToken(refreshToken) {
    console.log("Attempting to renew access token.");
    const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        console.log("Access token successfully renewed.");
        return data.access;
    } else {
        console.error('Failed to renew access token:', data);
        throw new Error('Failed to renew access token');
    }
}

async function fetchWithToken(url, options = {}) {
    let accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (isTokenExpired(accessToken)) {
        console.log("Access token is expired, renewing token...");
        try {
            accessToken = await renewAccessToken(refreshToken);
        } catch (error) {
            console.error('Token renewal failed or refresh token expired:', error);
            navigateTo('/sign-in');
            return;
        }
    }

    console.log(`Making API call to ${url}`);
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const jsonResponse = await response.json();
    console.log(`Response from ${url}:`, jsonResponse);
    return jsonResponse;
}

export { clearTokens, refreshUserID, getUserIDFromToken, renewAccessToken, fetchWithToken };
