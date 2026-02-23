import { useState, useEffect } from 'react';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import BookingList from './BookingList';
import TransactionList from './TransactionList';
import './App.css';

// Αν έχεις το LogFile, κάνε το import εδώ. Προς το παρόν το αφήνουμε όπως το είχες.
// import LogFile from './LogFile';

function App() {
    const [view, setView] = useState('home');
    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [cleaningTimers, setCleaningTimers] = useState({});

    // --- ΝΕΑ STATES ΓΙΑ ΤΙΣ ΚΡΑΤΗΣΕΙΣ ---
    const [selectedRoomId, setSelectedRoomId] = useState(null); // Ποιο δωμάτιο πατήσαμε
    const [unassignedCustomers, setUnassignedCustomers] = useState([]); // Οι ελεύθεροι πελάτες
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]); // Αυτοί που τσεκάραμε

    // Φόρτωση Δωματίων
    useEffect(() => {
        fetch('http://localhost:8080/api/rooms')
            .then(res => res.json())
            .then(data => setRooms(data));
    }, []);

    // Χρονόμετρο Καθαρισμού (1 λεπτό = 60 δευτερόλεπτα)
    useEffect(() => {


        rooms.forEach(room => {
            if (room.status === 'CLEANING' && !cleaningTimers[room.roomNumber]) {
                // Αν βρει δωμάτιο που καθαρίζεται, του δίνει 60 δευτερόλεπτα
                setCleaningTimers(prev => ({ ...prev, [room.roomNumber]: 60 }));
            }
        });

        // Κάθε 1 δευτερόλεπτο, μειώνει τον χρόνο κατά 1
        const timer = setInterval(() => {
            setCleaningTimers(prevTimers => {
                const newTimers = { ...prevTimers };

                Object.keys(newTimers).forEach(roomNum => {
                    if (newTimers[roomNum] > 0) {
                        newTimers[roomNum] -= 1;

                        // Αν φτάσει στο 0, λέμε στη Java να το κάνει AVAILABLE
                        if (newTimers[roomNum] === 0) {
                            fetch(`http://localhost:8080/api/rooms/${roomNum}/make-available`, { method: 'PUT' })
                                .then(() => {
                                    setRooms(prevRooms => prevRooms.map(r => r.roomNumber === parseInt(roomNum) ? { ...r, status: 'AVAILABLE' } : r));
                                });
                        }
                    }
                });
                return newTimers;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [rooms]);


    const filteredRooms = rooms.filter(room => {
        if (filter === 'ALL') return true;
        if (filter === 'seaView') return room.seaView === true;
        return room.status === filter;
    })
    .sort((a, b) => a.roomNumber - b.roomNumber);

    // --- ΝΕΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΚΡΑΤΗΣΗΣ ---

    // 1. Βρίσκει πόσα άτομα χωράει το δωμάτιο
    const getCapacity = (type) => {
        if (!type) return 2;
        const t = type.toLowerCase();
        if (t.includes('μονό') || t.includes('single')) return 2;
        if (t.includes('δί') || t.includes('double')) return 3;
        if (t.includes('τρί') || t.includes('triple')) return 4;
        if (t.includes('σουίτα') || t.includes('suite')) return 5;
        return 2;
    };

    // 2. Όταν πατάμε ένα ΔΙΑΘΕΣΙΜΟ δωμάτιο
    const handleRoomClick = (roomNumber) => {
        if (selectedRoomId === roomNumber) {
            setSelectedRoomId(null); // Αν το ξαναπατήσουμε, κλείνει
            setSelectedCustomerIds([]);
            return;
        }
        setSelectedRoomId(roomNumber);
        setSelectedCustomerIds([]);

        // Ζητάμε από το Backend τους πελάτες που δεν έχουν δωμάτιο
        fetch('http://localhost:8080/api/customers/unassigned')
            .then(res => res.json())
            .then(data => setUnassignedCustomers(data))
            .catch(err => console.error("Σφάλμα φόρτωσης πελατών:", err));
    };

    // 3. Όταν τσεκάρουμε/ξε-τσεκάρουμε έναν πελάτη
    const handleCustomerToggle = (customerId, maxCap) => {
        if (selectedCustomerIds.includes(customerId)) {
            // Αν είναι τσεκαρισμένος, τον βγάζουμε
            setSelectedCustomerIds(prev => prev.filter(id => id !== customerId));
        } else {
            // Αν όχι, ελέγχουμε αν χωράει άλλος
            if (selectedCustomerIds.length >= maxCap) {
                alert(`Αυτό το δωμάτιο χωράει μέχρι ${maxCap} άτομα!`);
            } else {
                setSelectedCustomerIds(prev => [...prev, customerId]);
            }
        }
    };

    // 4. Αποστολή Κράτησης στο Backend
    const handleBookRoom = (roomNumber) => {
        fetch(`http://localhost:8080/api/rooms/${roomNumber}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedCustomerIds)
        })
            .then(res => {
                if (!res.ok) throw new Error("Σφάλμα κατά την κράτηση!");
                return res.json();
            })
            .then(updatedRoom => {
                // Ενημερώνουμε τη λίστα των δωματίων άμεσα
                setRooms(rooms.map(r => r.roomNumber === roomNumber ? updatedRoom : r));
                setSelectedRoomId(null); // Κλείνουμε το μενού
                setSelectedCustomerIds([]);
                alert("Η κράτηση ολοκληρώθηκε με επιτυχία!");
            })
            .catch(err => alert(err.message));
    };

    return (
        <div className="my-hotel">
            <nav className="navbar">
                <div className="logo" onClick={() => setView('home')} style={{cursor: 'pointer'}}>🏨 The Blue Hotel</div>
                <div className="nav-buttons">
                    <button onClick={() => setView('rooms')} className={view === 'rooms' ? 'active' : ''}>Δωμάτια</button>
                    <button onClick={() => setView('add-customer')} className={view === 'add-customer' ? 'active' : ''}>Νέος Πελάτης</button>
                    <button onClick={() => setView('list-customers')} className={view === 'list-customers' ? 'active' : ''}>Λίστα Πελατών</button>
                    <button onClick={() => setView('bookings')} className={view === 'bookings' ? 'active' : ''}>Κρατήσεις</button>
                    <button onClick={() => setView('transactions')} className={view === 'transactions' ? 'active' : ''}>Συναλλαγές</button>
                    <button onClick={() => setView('log-file')} className={view === 'log-file' ? 'active' : ''}>Αρχείο</button>
                </div>
            </nav>

            <div className="content-area">
                {view === 'home' && (
                    <div className="home-screen">
                        <img src="/hotel-logo.jpg" alt="The Blue Hotel Logo" className="main-logo-img" />
                    </div>
                )}

                {view === 'rooms' && (
                    <>
                        <div className="filter-container">
                            <span className="filter-label">Προβολή:</span>
                            <select className="filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="ALL">Όλα τα δωμάτια</option>
                                <option value="AVAILABLE">Διαθέσιμα</option>
                                <option value="NOT_AVAILABLE">Μη Διαθέσιμα</option>
                                <option value="CLEANING">Σε καθαρισμό</option>
                                <option value="seaView">Με θέα στην θάλασσα</option>
                            </select>
                        </div>

                        <div className="room-container">
                            {filteredRooms.map(room => (
                                <div
                                    key={room.roomNumber}
                                    className={`room-box ${room.status} ${selectedRoomId === room.roomNumber ? 'selected-room' : ''}`}
                                    onClick={() => {
                                        if (room.status === 'AVAILABLE') handleRoomClick(room.roomNumber);
                                    }}
                                    style={{ cursor: room.status === 'AVAILABLE' ? 'pointer' : 'default' }}
                                >
                                    <h2>Δωμάτιο {room.roomNumber}</h2>
                                    <p><strong>Τύπος:</strong> {room.type}</p>
                                    <p><strong>Τιμή:</strong> {room.price}€</p>
                                    <p className="status-label">
                                        {room.status === 'AVAILABLE' ? '✔️ Διαθέσιμο' :
                                            (room.status === 'CLEANING' ? `🧹 Καθαρισμός... (${cleaningTimers[room.roomNumber] || 0}s)` : '❌ Μη Διαθέσιμο')}
                                    </p>
                                    {room.seaView && <p className="seaView-label">✔️ Θέα στην θάλασσα</p>}

                                    {/* ΕΜΦΑΝΙΣΗ ΠΕΛΑΤΩΝ ΑΝ ΤΟ ΔΩΜΑΤΙΟ ΕΙΝΑΙ ΚΛΕΙΣΜΕΝΟ */}
                                    {room.status !== 'AVAILABLE' && room.status !== 'CLEANING' && room.customers && room.customers.length > 0 && (
                                        <div className="booked-customers" style={{ marginTop: '15px', backgroundColor: '#fdfdfd', padding: '10px', borderRadius: '5px' }}>
                                            <strong>Ενοικιαστές:</strong>
                                            <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '0.9em', textAlign: 'left' }}>
                                                {room.customers.map(c => (
                                                    <li key={c.id}>{c.lastName} {c.firstName}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* ΦΟΡΜΑ ΚΡΑΤΗΣΗΣ (Εμφανίζεται μόνο στο κλικαρισμένο διαθέσιμο δωμάτιο) */}
                                    {selectedRoomId === room.roomNumber && room.status === 'AVAILABLE' && (
                                        <div className="booking-panel" onClick={(e) => e.stopPropagation()} style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1em' }}>Επιλογή Πελατών (Έως {getCapacity(room.type)}):</h4>

                                            {unassignedCustomers.length === 0 ? (
                                                <p style={{ fontSize: '0.85em', color: '#d32f2f' }}>Δεν υπάρχουν ελεύθεροι πελάτες στο σύστημα!</p>
                                            ) : (
                                                <div className="customer-checkboxes" style={{ maxHeight: '100px', overflowY: 'auto', textAlign: 'left', marginBottom: '10px' }}>
                                                    {unassignedCustomers.map(c => (
                                                        <div key={c.id} style={{ marginBottom: '5px' }}>
                                                            <label style={{ fontSize: '0.9em', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedCustomerIds.includes(c.id)}
                                                                    onChange={() => handleCustomerToggle(c.id, getCapacity(room.type))}
                                                                    style={{ marginRight: '8px' }}
                                                                />
                                                                {c.lastName} {c.firstName}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleBookRoom(room.roomNumber)}
                                                disabled={selectedCustomerIds.length === 0}
                                                style={{
                                                    width: '100%', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                                                    backgroundColor: selectedCustomerIds.length === 0 ? '#ccc' : '#28a745',
                                                    color: 'white', fontWeight: 'bold'
                                                }}
                                            >
                                                Προσθήκη Πελατών
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {view === 'add-customer' && <CustomerForm />}
                {view === 'list-customers' && <CustomerList />}
                {view === 'bookings' && <BookingList />}
                {view === 'transactions' && <TransactionList />}

                {/* Το είχες γράψει <LogFile /> αλλά δεν υπάρχει component προς το παρόν. Το αφήνω σε comment. */}
                {/* {view === 'log-file' && <LogFile />} */}
            </div>
        </div>
    );
}

export default App;