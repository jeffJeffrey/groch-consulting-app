import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allSubscriptions() {
    try {
        const response = await fetchWithAuth(`${API_URL}/subscriptions`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createSubscription(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const subscription = await response.json();
        return subscription;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function retrieveSubscription(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/subscriptions/${id}`)

        const user = await response.json();
        return user;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updateSubscription(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/subscriptions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const subscription = await response.json();
        return subscription;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroySubscription(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/subscriptions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

    } catch (error) {
        return Promise.reject(error);
    }
}