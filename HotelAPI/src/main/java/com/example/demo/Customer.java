package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "customer")

public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "lastname")
    private String lastName;

    @Column(name = "firstname")
    private String firstName;

    @Column(name = "nationality")
    private String nationality;

    @Column (name = "passport")
    private String passport;

    @Column (name = "gender")
    private String gender;

    @Column (name = "birth")
    private java.time.LocalDate birth;

    @Column (name = "phonenumber")
    private String phoneNumber;

    @Column (name = "email")
    private String email;


    public Integer getId () { return id; }
    public String getLastName () { return lastName; }
    public String getFirstName () { return firstName; }
    public String getNationality () { return nationality; }
    public String getPassport () { return passport; }
    public String getGender () {return gender; }
    public java.time.LocalDate getBirth () { return birth; }
    public String getPhoneNumber () { return phoneNumber; }
    public String getEmail () { return email; }


    public void setId (Integer id) { this.id = id; }
    public void setLastName (String lastName) { this.lastName = lastName; }
    public void setFirstName (String firstName) { this.firstName = firstName; }
    public void setNationality (String nationality) { this.nationality = nationality; }
    public void setPassport (String passport) { this.passport = passport; }
    public void setGender (String gender) { this.gender = gender; }
    public void setBirth (java.time.LocalDate birth) { this.birth = birth; }
    public void setPhoneNumber (String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setEmail (String email) { this.email = email; }


}
