import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allPrescriptions() {
    try {
        const response = await fetchWithAuth(`${API_URL}/prescriptions`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createPrescription(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/prescriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const prescription = await response.json();
        return prescription;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updatePrescription(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/prescriptions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const prescription = await response.json();
        return prescription;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroyPrescription(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/prescriptions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

    } catch (error) {
        return Promise.reject(error);
    }
}