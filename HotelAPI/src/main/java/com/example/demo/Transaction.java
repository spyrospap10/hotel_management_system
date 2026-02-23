package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String type; // "INCOME" (Έσοδο) ή "EXPENSE" (Έξοδο)
    private String category; // π.χ. "Διαμονή", "Μισθοδοσία"

    private LocalDateTime date;

    // Γεμίζει αυτόματα την ώρα που γίνεται η πληρωμή
    @PrePersist
    protected void onCreate() {
        date = LocalDateTime.now();
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}