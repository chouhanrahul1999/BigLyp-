import type { User, Task, AuthResponse, TaskStatus } from "@/types";

const BASE_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "";

type ErrorBody = string | { fieldErrors?: Record<string, string[]>; formErrors?: string[] };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
    });

    const data = await res.json() as T & { error?: ErrorBody };

    if (!res.ok) {
        const err = data.error;
        if (!err) throw new Error("Something went wrong");
        if (typeof err === "string") throw new Error(err);
        const msgs = [...Object.values(err.fieldErrors ?? {}).flat(), ...(err.formErrors ?? [])];
        throw new Error(msgs.join(", ") || "Something went wrong");
    }

    return data;
}

function authHeaders(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
}

export const api = {
    auth: {
        register: (body: { name: string; email: string; password: string }) =>
            request<User>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

        login: (body: { email: string; password: string }) =>
            request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

        me: (token: string) =>
            request<User>("/api/auth/me", { headers: authHeaders(token) }),
    },

    tasks: {
        list: (token: string, status?: TaskStatus) =>
            request<Task[]>(`/api/tasks${status ? `?status=${status}` : ""}`, {
                headers: authHeaders(token),
            }),

        get: (token: string, id: string) =>
            request<Task>(`/api/tasks/${id}`, { headers: authHeaders(token) }),

        create: (token: string, body: { title: string; description?: string; status?: TaskStatus; dueDate?: number }) =>
            request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(body), headers: authHeaders(token) }),

        update: (token: string, id: string, body: { title?: string; description?: string; status?: TaskStatus; dueDate?: number }) =>
            request<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(body), headers: authHeaders(token) }),

        delete: (token: string, id: string) =>
            request<{ message: string }>(`/api/tasks/${id}`, { method: "DELETE", headers: authHeaders(token) }),
    },
};
