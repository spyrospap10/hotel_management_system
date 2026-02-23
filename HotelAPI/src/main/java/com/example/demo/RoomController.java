package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin
public class RoomController {

    // Εδώ είναι η μαγεία (Dependency Injection):
    // Λέμε στο Spring Boot "Δώσε μου έτοιμο το εργαλείο αναζήτησης"
    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Room> getRooms() {
        // Τέρμα τα "καρφωτά" μηνύματα!
        // Λέμε στον αναζητητή: "Πήγαινε στη βάση και φέρε μου ΟΛΑ τα δωμάτια"
        return roomRepository.findAll();
    }

    @GetMapping("/available")
    public List<Room> getAvailableRooms() {
        // Καλούμε τη νέα μας μέθοδο και της ζητάμε μόνο τα AVAILABLE!
        return roomRepository.findByStatus(RoomStatus.AVAILABLE);
    }

    @GetMapping("/not_available")
    public List<Room> getNotAvailableRooms() {
        return roomRepository.findByStatus(RoomStatus.NOT_AVAILABLE);
    }

    @GetMapping("/cleaning")
    public List<Room> getCleaningRooms() {
        return roomRepository.findByStatus(RoomStatus.CLEANING);
    }

    @GetMapping("/seaView")
    public List<Room> getSeaViewRooms() {
        return roomRepository.findBySeaView(true);
    }

    @Autowired
    private CustomerRepository customerRepository; // Σιγουρέψου ότι το έχεις κάνει @Autowired πάνω-πάνω!


    // Ο μηχανισμός της κράτησης (Booking)
    @PostMapping("/{roomNumber}/book")
    public Room bookRoom(@PathVariable Integer roomNumber, @RequestBody List<Integer> customerIds) {

        Room room = roomRepository.findById(roomNumber)
                .orElseThrow(() -> new RuntimeException("Το δωμάτιο δεν βρέθηκε!"));

        // 1. Έλεγχος Ορίων βάσει του τύπου δωματίου
        int maxCapacity = 2; // Προεπιλογή
        String roomType = room.getType().toLowerCase();

        // Προσάρμοσε τα String ανάλογα με το πώς τα έχεις γράψει στη βάση σου
        if (roomType.contains("μονόκλινο") || roomType.contains("single")) maxCapacity = 2;
        else if (roomType.contains("δίκλινο") || roomType.contains("double")) maxCapacity = 3;
        else if (roomType.contains("τρίκλινο") || roomType.contains("triple")) maxCapacity = 4;
        else if (roomType.contains("σουίτα") || roomType.contains("suite")) maxCapacity = 5;

        if (customerIds.size() > maxCapacity) {
            throw new RuntimeException("Υπέρβαση ορίου! Το δωμάτιο χωράει μέχρι " + maxCapacity + " άτομα.");
        }

        // 2. Ενημέρωση των Πελατών (Τους βάζουμε στο δωμάτιο)
        List<Customer> customersToBook = customerRepository.findAllById(customerIds);
        for (Customer customer : customersToBook) {
            customer.setRoom(room);
            customerRepository.save(customer);
        }

        // 3. Ενημέρωση Κατάστασης Δωματίου
        // ΠΡΟΣΟΧΗ: Άλλαξε το "UNAVAILABLE" με την ακριβή λέξη που έχεις βάλει στο RoomStatus enum σου!
        room.setStatus(RoomStatus.NOT_AVAILABLE);

        return roomRepository.save(room);
    }

    // Διαγραφή Κράτησης (Ελευθέρωση Δωματίου)
    @DeleteMapping("/{roomNumber}/book")
    public Room clearBooking(@PathVariable Integer roomNumber) {
        Room room = roomRepository.findById(roomNumber)
                .orElseThrow(() -> new RuntimeException("Το δωμάτιο δεν βρέθηκε!"));

        // 1. Βρίσκουμε τους πελάτες του δωματίου και αφαιρούμε τη σύνδεση
        List<Customer> customers = room.getCustomers();
        if (customers != null) {
            for (Customer customer : customers) {
                customer.setRoom(null); // Τους "ξενοικιάζουμε"
                customerRepository.save(customer);
            }
        }

        // 2. Ελευθερώνουμε το δωμάτιο
        room.setStatus(RoomStatus.AVAILABLE);

        return roomRepository.save(room);
    }

    // 1. Πληρωμή, Διαγραφή Πελατών και έναρξη Καθαρισμού
    @DeleteMapping("/{roomNumber}/checkout")
    public Room checkoutAndClean(@PathVariable Integer roomNumber) {
        Room room = roomRepository.findById(roomNumber)
                .orElseThrow(() -> new RuntimeException("Το δωμάτιο δεν βρέθηκε!"));

        // Αποσύνδεση των πελατών με ασφάλεια για να μην "παραπονεθεί" η βάση (Hibernate)
        if (room.getCustomers() != null && !room.getCustomers().isEmpty()) {
            List<Customer> customersToDelete = new java.util.ArrayList<>(room.getCustomers());
            room.setCustomers(new java.util.ArrayList<>()); // Αδειάζουμε τη λίστα του δωματίου

            for (Customer customer : customersToDelete) {
                customer.setRoom(null); // Τους "ξενοικιάζουμε"
                customerRepository.save(customer); // Αποθηκεύουμε την αλλαγή
                customerRepository.delete(customer); // Τους διαγράφουμε οριστικά
            }
        }

        // Το δωμάτιο μπαίνει σε κατάσταση CLEANING
        room.setStatus(RoomStatus.CLEANING);
        return roomRepository.save(room);
    }

    // 2. Το δωμάτιο έγινε πάλι Διαθέσιμο (μετά το χρονόμετρο)
    @PutMapping("/{roomNumber}/make-available")
    public Room makeAvailable(@PathVariable Integer roomNumber) {
        Room room = roomRepository.findById(roomNumber)
                .orElseThrow(() -> new RuntimeException("Το δωμάτιο δεν βρέθηκε!"));

        room.setStatus(RoomStatus.AVAILABLE);
        return roomRepository.save(room);
    }

}