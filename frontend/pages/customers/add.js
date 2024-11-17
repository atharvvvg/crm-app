import { useState } from "react";
import { addCustomer } from "../../services/api";

export default function AddCustomer() {
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [error, setError] = useState("");
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        totalSpending: '',
        visits: '',
        lastVisit: '',
      });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
          ...prev,
          [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCustomer({
                name: customer.name,
                email: customer.email,
                totalSpending: customer.totalSpending,
                visits: customer.visits,
                lastVisit: customer.lastVisit
            });
            setCustomer({
                name: '',
                email: '',
                totalSpending: 0,
                visits: 0,
                lastVisit: ''
            });
            alert("Customer added successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Add Customer</h1>
            {/* {error && <p>Error: {error}</p>} */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Name"
                    value={customer.name}
                    onChange={handleChange}
                    name="name"
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={customer.email}
                    onChange={handleChange}
                    name="email"
                    required
                    style={styles.input}
                />
                <input
                    type="number"
                    name="totalSpending"
                    placeholder="Total Spending"
                    value={customer.totalSpending}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="number"
                    name="visits"
                    placeholder="Number of Visits"
                    value={customer.visits}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="date"
                    name="lastVisit"
                    value={customer.lastVisit}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Add</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        width: '300px',
        margin: 'auto'
    },
    header: {
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    input: {
        padding: '8px',
        margin: '5px 0',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    }
};
