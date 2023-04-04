import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allPatients() {
    try {
        const response = await fetchWithAuth(`${API_URL}/patients`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createPatient(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const patient = await response.json();
        return patient;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function retrievePatient(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/patients/${id}`)

        const user = await response.json();
        return user;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updatePatient(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/patients/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const patient = await response.json();
        return patient;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroyPatient(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/patients/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

    } catch (error) {
        return Promise.reject(error);
    }
}