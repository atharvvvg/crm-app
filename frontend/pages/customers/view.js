import { useEffect, useState } from "react";
import { fetchCustomers, deleteCustomer } from "../../services/api";

export default function ViewCustomers() {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCustomers()
            .then(setCustomers)
            .catch((err) => setError(err.message));
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteCustomer(id);
            setCustomers(customers.filter((customer) => customer._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.customerList}>
            <h1>Customer List</h1>
            {customers.length === 0 ? (
                <p>No customers available.</p>
            ) : (
                <ul style={styles.customerItems}>
                    {customers.map((customer) => (
                        <li key={customer._id} style={styles.customerItem}>
                            <div style={styles.customerInfo}>
                                <p><strong>Name:</strong> {customer.name}</p>
                                <p><strong>Email:</strong> {customer.email}</p>
                                <p><strong>Total Spending:</strong> ${customer.totalSpending}</p>
                                <p><strong>Visits:</strong> {customer.visits}</p>
                                <p><strong>Last Visit:</strong> {formatDate(customer.lastVisit)}</p>
                            </div>
                            <button style={styles.deleteButton} onClick={() => handleDelete(customer._id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = {
    customerList: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
    },
    customerItems: {
        listStyleType: 'none',
        padding: 0
    },
    customerItem: {
        border: '1px solid #ddd',
        padding: '10px',
        margin: '10px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9'
    },
    customerInfo: {
        flexGrow: 1
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
        borderRadius: '4px'
    },
    deleteButtonHover: {
        backgroundColor: '#c0392b'
    },
    error: {
        color: 'red',
        fontWeight: 'bold'
    }
};
