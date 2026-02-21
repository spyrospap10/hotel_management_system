import { useState, useEffect } from 'react';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import './App.css';

function App() {
    // Εδώ κρατάμε ποια "σελίδα" βλέπει ο χρήστης
    const [view, setView] = useState('home');
    const [rooms, setRooms] = useState([]);

    const [filter, setFilter] = useState('ALL');

    // Φόρτωση Δωματίων
    useEffect(() => {
        fetch('http://localhost:8080/api/rooms')
            .then(res => res.json())
            .then(data => setRooms(data));
    }, []);

    const filteredRooms = rooms.filter(room => {
        if (filter === 'ALL') {
            return true;
        }
        else if (filter === 'seaView') {
            return room.seaView === true;
        }
        else {
            return room.status === filter;
        }
    });

    return (
        <div className="my-hotel">

            {/* --- ΤΟ ΜΕΝΟΥ --- */}
            <nav className="navbar">
                <div className="logo" onClick={() => setView('home')}>🏨 The Blue Hotel</div>
                <div className="nav-buttons">
                    <button onClick={() => setView('rooms')} className={view === 'rooms' ? 'active' : ''}>Δωμάτια</button>
                    <button onClick={() => setView('add-customer')} className={view === 'add-customer' ? 'active' : ''}>Νέος Πελάτης</button>
                    <button onClick={() => setView('list-customers')} className={view === 'list-customers' ? 'active' : ''}>Προβολή Πελατών</button>
                </div>
            </nav>

            {/* --- ΤΙ ΔΕΙΧΝΟΥΜΕ ΣΤΗΝ ΟΘΟΝΗ --- */}
            <div className="content-area">

                {/* ΑΡΧΙΚΗ ΣΕΛΙΔΑ */}
                {view === 'home' && (
                    <div className="home-screen">
                        <img src="/hotel-logo.jpg" alt="The Blue Hotel Logo" className="main-logo-img" />
                    </div>
                )}

                {/* ΠΕΡΙΠΤΩΣΗ 1: ΔΩΜΑΤΙΑ */}
                {view === 'rooms' && (
                    <>
                        {/* Το Dropdown του Φίλτρου */}
                        <div className="filter-container">
                            <span className="filter-label">Προβολή:</span>
                            <select
                                className="filter-dropdown"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="ALL">Όλα τα δωμάτια</option>
                                <option value="AVAILABLE">Διαθέσιμα</option>
                                <option value="NOT_AVAILABLE">Μη Διαθέσιμα</option>
                                <option value="CLEANING">Σε καθαρισμό</option>
                                <option value="seaView">Με θέα στην θάλασσα</option>
                            </select>
                        </div>

                        <div className="room-container">
                            {filteredRooms.map(room => (
                                <div key={room.roomNumber} className={`room-box ${room.status}`}>
                                    <h2>Δωμάτιο {room.roomNumber}</h2>
                                    <p><strong>Τύπος:</strong> {room.type}</p>
                                    <p><strong>Τιμή:</strong> {room.price}€</p>
                                    <p className="status-label">
                                        {room.status === 'AVAILABLE' ? '✔️ Διαθέσιμο' :
                                            (room.status === 'CLEANING' ? '🧹 Για Καθάρισμα' : '❌ Μη Διαθέσιμο')}
                                    </p>
                                    {room.seaView && (
                                        <p className="seaView-label">✔️ Θέα στην θάλασσα</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ΠΕΡΙΠΤΩΣΗ 2: ΦΟΡΜΑ */}
                {view === 'add-customer' && <CustomerForm />}

                {/* ΠΕΡΙΠΤΩΣΗ 3: ΛΙΣΤΑ */}
                {view === 'list-customers' && <CustomerList />}

            </div>
        </div>
    );
}

export default App;