import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allPayments() {
    try {
        const response = await fetchWithAuth(`${API_URL}/payments`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createPayment(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const payment = await response.json();
        return payment;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updatePayment(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/payments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const payment = await response.json();
        return payment;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroyPayment(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/payments/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

    } catch (error) {
        return Promise.reject(error);
    }
}