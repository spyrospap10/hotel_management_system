package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@RestController
@RequestMapping("/api/nationalities")
@CrossOrigin

public class NationalityController {
    @Autowired
    private NationalityRepository nationalityRepository;

    @GetMapping
    public List<Nationality> getNationalities() {
        return nationalityRepository.findAll();
    }

}
