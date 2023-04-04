import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allTypes() {
    try {
        const response = await fetchWithAuth(`${API_URL}/products-types`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createType(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/products-types`, {
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

export async function updateType(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/products-types/${id}`, {
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

export async function destroyType(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/products-types/${id}`, {
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