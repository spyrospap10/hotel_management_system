package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(RoomRepository roomRepository) {
		return args -> {
			// ΕΛΕΓΧΟΣ: Υπάρχουν ήδη δωμάτια;
			long count = roomRepository.count();

			if (count == 0) {
				// Αν η βάση είναι άδεια, ΤΟΤΕ μπαίνουμε εδώ και τα φτιάχνουμε
				System.out.println("⚠️ Η βάση είναι άδεια. Δημιουργία δωματίων...");

				for (int floor = 1; floor <= 9; floor++) {
					for (int i = 1; i <= 5; i++) {
						int roomNumber = (floor * 100) + i;

						Room room = new Room();
						room.setRoomNumber(roomNumber);
						room.setFloor(floor);
						room.setStatus(RoomStatus.AVAILABLE);

						// Η λογική των τύπων
						if (i == 1 || i == 2) {
							room.setType("Μονόκλινο");
							room.setPrice(50.0);
						} else if (i == 3) {
							room.setType("Δίκλινο");
							room.setPrice(80.0);
						} else if (i == 4) {
							room.setType("Τρίκλινο");
							room.setPrice(110.0);
						} else {
							room.setType("Σουίτα");
							room.setPrice(150.0);
						}
                        if (room.getRoomNumber() >= 800 && room.getRoomNumber() <= 905){
                            room.setSeaView(true);
                            room.setPrice(room.getPrice()+20);
                        }
                        else {
                            room.setSeaView(false);
                        }

						roomRepository.save(room);
					}
				}
				System.out.println("✅ Δημιουργήθηκαν 45 δωμάτια!");
			} else {
				// Αν βρήκε δωμάτια, δεν κάνει απολύτως τίποτα
				System.out.println("ℹ️ Βρέθηκαν ήδη " + count + " δωμάτια. Δεν χρειάζεται δημιουργία.");
			}
		};
	}

}