import React, { useState, useEffect } from 'react';

function BookingList() {
    const [bookedRooms, setBookedRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [showPayment, setShowPayment] = useState(false); // Για το παραθυράκι πληρωμής

    // 1. Φόρτωση μόνο των ΚΛΕΙΣΜΕΝΩΝ δωματίων
    const fetchBookings = () => {
        fetch('http://localhost:8080/api/rooms')
            .then(res => res.json())
            .then(data => {
                // Φιλτράρουμε τα δωμάτια που δεν είναι διαθέσιμα και έχουν μέσα πελάτες
                const bookings = data.filter(r => r.status !== 'AVAILABLE' && r.customers && r.customers.length > 0);
                setBookedRooms(bookings);
            })
            .catch(err => console.error("Σφάλμα φόρτωσης κρατήσεων:", err));
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // 2. Υπολογισμός Ημερών (Μαθηματικά ημερομηνιών)
    const calculateDays = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 1; // Αν ξέχασε να βάλει, χρεώνουμε 1 μέρα
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = outDate - inDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1; // Τουλάχιστον 1 μέρα χρέωση
    };

    // 3. Διαγραφή Κράτησης
    const handleDeleteBooking = (roomNumber) => {
        if (window.confirm(`Είστε σίγουρος ότι θέλετε να ακυρώσετε την κράτηση του Δωματίου ${roomNumber};\nΟι πελάτες δεν θα διαγραφούν.`)) {
            fetch(`http://localhost:8080/api/rooms/${roomNumber}/book`, {
                method: 'DELETE'
            })
                .then(() => {
                    alert("Η κράτηση διαγράφηκε και το δωμάτιο είναι ξανά διαθέσιμο!");
                    setSelectedRoomId(null);
                    setShowPayment(false);
                    fetchBookings(); // Ξαναφορτώνουμε τη λίστα
                })
                .catch(err => alert("Σφάλμα: " + err));
        }
    };

    //ΠΛΗΡΩΜΗ ΜΕΤΡΗΤΟΙΣ
    const handleCashPayment = (room) => {
        const customer = room.customers[0];
        const days = calculateDays(customer.checkIn, customer.checkOut);
        const totalAmount = days * room.price;

        if (window.confirm(`✅ Επιβεβαίωση:\nΛήφθηκε το ποσό των ${totalAmount}€ σε ΜΕΤΡΗΤΑ;\nΟι πελάτες θα διαγραφούν και το δωμάτιο θα μπει σε καθαρισμό.`)) {

            fetch(`http://localhost:8080/api/rooms/${room.roomNumber}/checkout`, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error("Σφάλμα κατά το checkout!");

                    // 2. Μόλις πετύχει, στέλνουμε τα λεφτά στα ΕΣΟΔΑ!
                    return fetch('http://localhost:8080/api/transactions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount: totalAmount,
                            type: 'INCOME',
                            category: `Διαμονή (Δωμάτιο ${room.roomNumber})`
                        })
                    });
                })
                .then(() => {
                    alert(`Η πληρωμή ολοκληρώθηκε! Τα ${totalAmount}€ προστέθηκαν στα Έσοδα.`);
                    window.location.reload();
                })
                .catch(err => alert("❌ Σφάλμα: " + err.message));
        }
    };

    return (
        <div className="table-container">
            <h2>Λίστα Ενεργών Κρατήσεων</h2>
            {bookedRooms.length === 0 ? (
                <p>Δεν υπάρχουν ενεργές κρατήσεις αυτή τη στιγμή.</p>
            ) : (
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th>Δωμάτιο</th>
                        <th>Πελάτες</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Ημέρες</th>
                        <th>Συνολική Τιμή</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookedRooms.map(room => {
                        // Παίρνουμε τις ημερομηνίες από τον πρώτο πελάτη του δωματίου
                        const primaryCustomer = room.customers[0];
                        const days = calculateDays(primaryCustomer.checkIn, primaryCustomer.checkOut);
                        const total = days * room.price;

                        return (
                            <React.Fragment key={room.roomNumber}>
                                <tr
                                    onClick={() => {
                                        setSelectedRoomId(selectedRoomId === room.roomNumber ? null : room.roomNumber);
                                        setShowPayment(false); // Κλείνει η πληρωμή αν αλλάξουμε γραμμή
                                    }}
                                    style={{ cursor: 'pointer', backgroundColor: selectedRoomId === room.roomNumber ? '#e3f2fd' : '' }}
                                >
                                    <td><strong>{room.roomNumber}</strong> ({room.type})</td>
                                    <td>
                                        {room.customers.map(c => c.lastName + " " + c.firstName).join(", ")}
                                    </td>
                                    <td>{primaryCustomer.checkIn || 'Μη ορισμένο'}</td>
                                    <td>{primaryCustomer.checkOut || 'Μη ορισμένο'}</td>
                                    <td>{days}</td>
                                    <td><strong>{total}€</strong></td>
                                </tr>

                                {/* Ενέργειες όταν είναι επιλεγμένο */}
                                {selectedRoomId === room.roomNumber && (
                                    <tr className="actions-row">
                                        <td colSpan="6" style={{ padding: '15px', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
                                            {!showPayment ? (
                                                <div>
                                                    <button onClick={() => setShowPayment(true)} className="btn-save" style={{ marginRight: '10px' }}>💳 Πληρωμή</button>
                                                    <button onClick={() => handleDeleteBooking(room.roomNumber)} className="btn-delete">❌ Διαγραφή Κράτησης</button>
                                                </div>
                                            ) : (
                                                <div style={{ border: '2px dashed #ccc', padding: '15px', display: 'inline-block', borderRadius: '8px', backgroundColor: '#fff' }}>
                                                    <h4 style={{ margin: '0 0 10px 0' }}>Επιλογή Μεθόδου Πληρωμής ({total}€)</h4>
                                                    <button onClick={() => handleCashPayment(room)} style={{ margin: '5px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>💵 Μετρητά</button>
                                                    <button onClick={() => alert("Σύνδεση με τερματικό POS... (Σε αναμονή υλοποίησης)")} style={{ margin: '5px', padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>💳 Κάρτα</button>
                                                    <br />
                                                    <button onClick={() => setShowPayment(false)} style={{ marginTop: '10px', padding: '5px 10px', fontSize: '0.8em', cursor: 'pointer' }}>Ακύρωση</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default BookingList;