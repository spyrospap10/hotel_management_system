import React, { useState, useEffect } from 'react';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    // State για τα δεδομένα που επεξεργαζόμαστε
    const [editData, setEditData] = useState(null);

    // 1. Φόρτωση πελατών από το Backend
    useEffect(() => {
        fetch('http://localhost:8080/api/customers')
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error("Σφάλμα φόρτωσης:", err));
    }, []);

    // 2. Διαγραφή Πελάτη
    const handleDelete = (id) => {
        if (window.confirm("Είστε σίγουρος για την διαγραφή του πελάτη;")) {
            fetch(`http://localhost:8080/api/customers/${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    setCustomers(customers.filter(c => c.id !== id));
                    setSelectedCustomerId(null);
                })
                .catch(err => console.error("Σφάλμα στη διαγραφή:", err));
        }
    };

    // 3. Έναρξη Επεξεργασίας (Γέμισμα της φόρμας με τα υπάρχοντα στοιχεία)
    const startEdit = (customer) => {
        setEditData({ ...customer });
    };

    // 4. Αποθήκευση Αλλαγών (PUT Request στο Backend)
    const handleSave = () => {
        fetch(`http://localhost:8080/api/customers/${editData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData)
        })
            .then(res => res.json())
            .then(updatedCustomer => {
                // Ενημέρωση της λίστας στο frontend χωρίς refresh
                setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
                setEditData(null); // Κλείσιμο φόρμας
                setSelectedCustomerId(null); // Αποεπιλογή γραμμής
                alert("Οι αλλαγές αποθηκεύτηκαν επιτυχώς!");
            })
            .catch(err => console.error("Σφάλμα στην αποθήκευση:", err));
    };

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
                    <React.Fragment key={c.id}>
                        <tr
                            onClick={() => {
                                if (!editData) setSelectedCustomerId(selectedCustomerId === c.id ? null : c.id);
                            }}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selectedCustomerId === c.id ? '#e3f2fd' : ''
                            }}
                        >
                            <td>{c.id}</td>
                            <td>{c.lastName}</td>
                            <td>{c.firstName}</td>
                            <td>{c.nationality}</td>
                            <td>{c.phoneNumber}</td>
                            <td>{c.email}</td>
                        </tr>

                        {selectedCustomerId === c.id && (
                            <tr className="actions-row">
                                <td colSpan="6" style={{ padding: '15px', backgroundColor: '#f8f9fa' }}>
                                    {editData ? (
                                        /* --- ΦΟΡΜΑ ΕΠΕΞΕΡΓΑΣΙΑΣ --- */
                                        <div className="edit-form-inline">
                                            <h4>Επεξεργασία Στοιχείων</h4>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    value={editData.lastName}
                                                    onChange={e => setEditData({...editData, lastName: e.target.value})}
                                                    placeholder="Επώνυμο"
                                                />
                                                <input
                                                    type="text"
                                                    value={editData.firstName}
                                                    onChange={e => setEditData({...editData, firstName: e.target.value})}
                                                    placeholder="Όνομα"
                                                />
                                                <input
                                                    type="text"
                                                    value={editData.nationality}
                                                    onChange={e => setEditData({...editData, nationality: e.target.value})}
                                                    placeholder="Εθνικότητα"
                                                />
                                            </div>
                                            <div className="button-group" style={{ marginTop: '10px' }}>
                                                <button onClick={handleSave} className="btn-save">Αποθήκευση ✅</button>
                                                <button onClick={() => setEditData(null)} className="btn-cancel">Ακύρωση ❌</button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* --- ΑΠΛΑ ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ --- */
                                        <div style={{ textAlign: 'center' }}>
                                            <button onClick={() => startEdit(c)} className="btn-edit">Επεξεργασία ✏️</button>
                                            <button onClick={() => handleDelete(c.id)} className="btn-delete" style={{ marginLeft: '10px' }}>Διαγραφή 🗑️</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerList;