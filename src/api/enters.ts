import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allEnters() {
    try {
        const response = await fetchWithAuth(`${API_URL}/enters`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createEnter(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/enters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const enter = await response.json();
        return enter;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updateEnter(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/enters/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const enter = await response.json();
        return enter;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroyEnter(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/enters/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const enter = await response.json();
        return enter;
    } catch (error) {
        return Promise.reject(error);
    }
}