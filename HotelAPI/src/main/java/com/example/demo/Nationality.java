package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "nationality")

public class Nationality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    public Integer getId () {return id;}
    public String getName () {return name;}

    public void setId (Integer id) {this.id = id;}
    public void setName (String name) {this.name = name;}
}
