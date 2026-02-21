package com.example.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "room")
public class Room {

    @Id
    @Column(name = "roomnumber")
    private Integer roomNumber;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "type")
    private String type;

    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status;

    @Column(name = "price")
    private Double price;

    @Column(name = "seaView")
    private Boolean seaView;


    // ----------- Getters -----------
    public Integer getRoomNumber() { return roomNumber; }
    public Integer getFloor() { return floor; }
    public String getType() { return type; }
    public RoomStatus getStatus() { return status; }
    public Double getPrice() { return price; }
    public Boolean getSeaView() { return seaView; }

    // ----------- Setters -----------
    public void setRoomNumber(Integer roomNumber) { this.roomNumber = roomNumber; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public void setType(String type) { this.type = type; }
    public void setStatus(RoomStatus status) { this.status = status; }
    public void setPrice(Double price) { this.price = price; }
    public void setSeaView(Boolean seaView) { this.seaView = seaView; };
}