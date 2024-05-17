import { navigateTo } from "/static/js/services/index.js";

function isTokenExpired(token) {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    const exp = decoded.exp * 1000; // JWT 'exp' claims are in seconds, convert to milliseconds
    const now = new Date();
    const isExpired = now.getTime() > exp;
    console.log(`Token expired: ${isExpired}`);
    return isExpired;
}

function isLoggedIn() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        //console.log("No token found, user not logged in.");
        return false;
    }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        const isExpired = payload.exp < now;
        //console.log(`Token expiration check: ${isExpired ? 'expired' : 'valid'}`);
        return !isExpired;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
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

export { fetchWithToken, isLoggedIn, renewAccessToken };
