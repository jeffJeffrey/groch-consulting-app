import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allDiagnostics() {
    try {
        const response = await fetchWithAuth(`${API_URL}/diagnostics`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createDiagnostic(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/diagnostics`, {
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

export async function updateDiagnostic(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/diagnostics/${id}`, {
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

export async function destroyDiagnostic(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/diagnostics/${id}`, {
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