const API_BASE_URL = "http://localhost:3000/api";

export async function fetchCustomers() {
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (!response.ok) throw new Error("Failed to fetch customers");
    return await response.json();
}

export async function addCustomer(customer) {
    const response = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    });
    if (!response.ok) throw new Error("Failed to add customer");
    return await response.json();
}

export async function deleteCustomer(id) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete customer");
}
