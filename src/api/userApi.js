// src/api/authApi.js
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

export async function registerUser(payload, licenseFile = null) {
    const hasFile = licenseFile instanceof File;

    let response;

    if (hasFile) {
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (key === "specialization" && Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });

        formData.append("licenseDocument", licenseFile);

        response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            body: formData,
        });

    } else {
        response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed");
    }

    return data;
}

export const login = (email, password) => {
    return fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then(res => res.json())
        .catch(error => console.log(error))
};

export const keepLoggedIn = (data) => {
    console.log(data)
    localStorage.setItem('auth', JSON.stringify(data))
}

export const isLoggedIn = () => {
    return (localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : false)
}