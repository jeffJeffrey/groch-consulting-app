import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allUsers() {
    try {
        const response = await fetchWithAuth(`${API_URL}/users`);
        const data = await response.json();
        if (!response.ok) return Promise.reject(response)
        return data;

    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createUser(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const user = await response.json();
        if (!response.ok) return Promise.reject(response)
        return user;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function login(data: any) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const json = await response.json();
        if (!response.ok) return Promise.reject(response)
        return json;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function updateUser(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const user = await response.json();
        if (!response.ok) return Promise.reject(response)
        return user;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function retrieveUser(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/users/${id}`)

        const user = await response.json();
        if (!response.ok) return Promise.reject(response)
        return user;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroyUser(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

    } catch (error) {
        return Promise.reject(error);
    }
}