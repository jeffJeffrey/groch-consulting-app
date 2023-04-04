import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allSpents() {
    try {
        const response = await fetchWithAuth(`${API_URL}/spents`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createSpent(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/spents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const spent = await response.json();
        return spent;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updateSpent(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/spents/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const spent = await response.json();
        return spent;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroySpent(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/spents/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const spent = await response.json();
        return spent;
    } catch (error) {
        return Promise.reject(error);
    }
}