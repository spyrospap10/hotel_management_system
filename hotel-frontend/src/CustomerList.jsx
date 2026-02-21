import { useState, useEffect } from 'react';

function CustomerList() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/customers')
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="table-container">
            <h2>Λίστα Πελατών</h2>
            <table className="custom-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Επώνυμο</th>
                    <th>Όνομα</th>
                    <th>Εθνικότητα</th>
                    <th>Τηλέφωνο</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {customers.map(c => (
                    <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.lastName}</td>
                        <td>{c.firstName}</td>
                        <td>{c.nationality}</td>
                        <td>{c.phoneNumber}</td>
                        <td>{c.email}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerList;