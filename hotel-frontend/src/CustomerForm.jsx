import React, { useState, useEffect } from 'react';

function CustomerForm() {
    // 1. Προσθήκη checkIn και checkOut στην αρχική κατάσταση
    const initialState = {
        lastName: '', firstName: '', nationality: '', gender: 'Άντρας',
        birth: '', idType: 'Ταυτότητα', passport: '', phoneNumber: '', email: '',
        checkIn: '', checkOut: '' // <--- ΝΕΑ ΠΕΔΙΑ
    };

    const [formData, setFormData] = useState(initialState);
    const [nationalities, setNationalities] = useState([]);
    // 2. Νέο state για να κρατάμε τους πελάτες για το dropdown
    const [customers, setCustomers] = useState([]);

    // Μόλις ανοίξει η φόρμα, φέρε τις χώρες ΚΑΙ τους πελάτες από το Backend
    useEffect(() => {
        // Φόρτωση Εθνικοτήτων
        fetch('http://localhost:8080/api/nationalities')
            .then(res => res.json())
            .then(data => setNationalities(data))
            .catch(err => console.error("Σφάλμα στη φόρτωση εθνικοτήτων:", err));

        // Φόρτωση Πελατών (για το dropdown "Ταξιδεύω με")
        fetch('http://localhost:8080/api/customers')
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error("Σφάλμα στη φόρτωση πελατών:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(() => {
                alert('Ο πελάτης αποθηκεύτηκε!');
                setFormData(initialState); // Επαναφορά στο αρχικό (θα αδειάσουν και οι ημερομηνίες)
            })
            .catch(err => alert('Σφάλμα: ' + err));
    };

    return (
        <div className="form-container">
            <h2>Καταχώρηση Νέου Πελάτη</h2>
            <form onSubmit={handleSubmit} className="customer-form">
                <label>Επώνυμο *</label>
                <input type="text" name="lastName" value={formData.lastName} required onChange={handleChange} />

                <label>Όνομα *</label>
                <input type="text" name="firstName" value={formData.firstName} required onChange={handleChange} />

                <label>Εθνικότητα *</label>
                <select name="nationality" value={formData.nationality} onChange={handleChange}>
                    <option value="">Επιλέξτε...</option>
                    {nationalities.map(nat => (
                        <option key={nat.id} value={nat.name}>{nat.name}</option>
                    ))}
                </select>

                <label>Φύλο *</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Άντρας">Άντρας</option>
                    <option value="Γυναίκα">Γυναίκα</option>
                </select>

                <label>Ημερομηνία Γέννησης *</label>
                <input type="date" name="birth" value={formData.birth} required onChange={handleChange} />

                <div className="id-group">
                    <select name="idType" value={formData.idType} onChange={handleChange}>
                        <option value="Ταυτότητα">Ταυτότητα</option>
                        <option value="Διαβατήριο">Διαβατήριο</option>
                    </select>
                    <input type="text" name="passport" value={formData.passport} placeholder="Αριθμός..." required onChange={handleChange} />
                </div>

                <label>Τηλέφωνο *</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} required onChange={handleChange} />

                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />

                {/* --- ΝΕΑ ΠΕΔΙΑ ΓΙΑ ΚΡΑΤΗΣΗ --- */}
                <hr style={{ margin: '15px 0', border: '0.5px solid #ccc' }} />

                <label>Ταξιδεύω με:</label>
                <select
                    onChange={(e) => {
                        const companionId = e.target.value;
                        if (companionId) {
                            const companion = customers.find(c => c.id === parseInt(companionId));
                            if (companion) {
                                // Ενημερώνουμε το formData με τις ημερομηνίες του συνοδού
                                setFormData({
                                    ...formData,
                                    checkIn: companion.checkIn || '',
                                    checkOut: companion.checkOut || ''
                                });
                            }
                        }
                    }}
                >
                    <option value="">Επιλέξτε πελάτη (προαιρετικό)...</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.lastName} {c.firstName}
                        </option>
                    ))}
                </select>

                <label>Check In</label>
                <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} />

                <label>Check Out</label>
                <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} />
                {/* ----------------------------- */}

                <button type="submit" className="save-btn" style={{ marginTop: '20px' }}>Αποθήκευση</button>
            </form>
        </div>
    );
}

export default CustomerForm;