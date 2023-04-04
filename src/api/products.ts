import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allProducts() {
    try {
        const response = await fetchWithAuth(`${API_URL}/products`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createProduct(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const product = await response.json();
        return product;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updateProduct(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const product = await response.json();
        return product;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroyProduct(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

    } catch (error) {
        return Promise.reject(error);
    }
}