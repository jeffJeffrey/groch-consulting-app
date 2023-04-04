import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allMetrics() {
    try {
        const response = await fetchWithAuth(`${API_URL}/metrics`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
