import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allConsultations() {
    try {
        const response = await fetchWithAuth(`${API_URL}/consultations`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createConsultation(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/consultations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const consultation = await response.json();
        return consultation;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updateConsultation(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/consultations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const consultation = await response.json();
        return consultation;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function setConsultationAsBilled(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/consultations/${id}/billed`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const consultation = await response.json();
        return consultation;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroyConsultation(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/consultations/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

    } catch (error) {
        return Promise.reject(error);
    }
}

export async function retrieveConsultation(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/consultations/${id}`)

        const consultation = await response.json();
        if (!response.ok) return Promise.reject(response)
        return consultation;
    } catch (error) {
        return Promise.reject(error);
    }
}