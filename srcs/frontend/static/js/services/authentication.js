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

async function refreshUserID() {
    const originalUserID = USER_ID;

    // Get the USER_ID from the 'Access Token'
    try {
        const token = localStorage.getItem('accessToken');
        if (isTokenExpired(token)) {
            throw new Error('accessToken expired');
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        USER_ID = isTokenExpired(token) ? null : payload.user_id;

        const response = await Users.get(USER_ID);
        if (!response.success) {
            throw new Error('non existing user');
        }
    } catch (e) {
        clearTokens();
    }

    if (originalUserID == USER_ID) return;

    // The USER_ID changed,
    // If the USER_ID is valid regenerate the SOCKET
    if (USER_ID) {
        await generateSocket();
    }
}

async function renewAccessToken(refreshToken) {
    const response = await fetch(`${API_URL}/api/token/refresh/`, {
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
        console.error('Failed to renew access token');
        throw new Error('Failed to renew access token');
    }
}

async function fetchWithToken(path, options = {}) {
    let accessToken = localStorage.getItem('accessToken'),
        refreshToken = localStorage.getItem('refreshToken');

    if (isTokenExpired(accessToken)) {
        console.log("Access token is expired, renewing token...");
        try {
            accessToken = await renewAccessToken(refreshToken);
        } catch (error) {
            console.error('Token renewal failed:', error);
            return doLogout();
        }
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: Object.assign({}, options.headers, {
            Authorization: `Bearer ${accessToken}`,
            "x-access-token": accessToken,
        })
    });
    const jsonResponse = await response.json();

    return jsonResponse;
}

export { doLogout, getCSRFToken, clearTokens, refreshUserID, fetchWithToken };
