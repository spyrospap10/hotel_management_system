package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
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

}