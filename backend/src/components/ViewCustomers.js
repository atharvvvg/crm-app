import React, { useState, useEffect } from 'react';
import axios from 'axios';

// The ViewCustomers component to display the list of customers
const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers data when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/customers'); // Your backend endpoint
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customer data');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Customer List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total Spending</th>
            <th>Last Visit</th>
            <th>Visits</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.totalSpending}</td>
              <td>{new Date(customer.lastVisit).toLocaleDateString()}</td>
              <td>{customer.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCustomers;
