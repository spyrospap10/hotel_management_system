import { useState, useEffect } from 'react';

function CustomerForm() {
    // Η αρχική κατάσταση (άδεια πεδία)
    const initialState = {
        lastName: '', firstName: '', nationality: '', gender: 'Άντρας',
        birth: '', idType: 'Ταυτότητα', passport: '', phoneNumber: '', email: ''
    };

    const [formData, setFormData] = useState(initialState);

    const [nationalities, setNationalities] = useState([]);

    // Μόλις ανοίξει η φόρμα, φέρε τις χώρες από το Backend
    useEffect(() => {
        fetch('http://localhost:8080/api/nationalities')
            .then(res => res.json())
            .then(data => setNationalities(data))
            .catch(err => console.error("Σφάλμα στη φόρτωση εθνικοτήτων:", err));
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
                setFormData(initialState); // <--- ΕΔΩ ΤΟ ΜΑΓΙΚΟ: Επαναφορά στο αρχικό!
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
                        <option key={nat.id} value={nat.name}>
                            {nat.name}
                        </option>
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

                <button type="submit" className="save-btn">Αποθήκευση</button>
            </form>
        </div>
    );
}

export default CustomerForm;