import { API_URL } from ".";
import fetchWithAuth from "./http";

export async function allExams() {
    try {
        const response = await fetchWithAuth(`${API_URL}/exams`);
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function createExam(data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/exams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const exam = await response.json();
        return exam;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updateExam(id: any, data: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/exams/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const exam = await response.json();
        return exam;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function destroyExam(id: any) {
    try {
        const response = await fetchWithAuth(`${API_URL}/exams/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

    } catch (error) {
        return Promise.reject(error);
    }
}