package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin

public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Integer id) {
        customerRepository.deleteById(id);
    }

    // 2. Ενημέρωση Πελάτη
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Integer id, @RequestBody Customer updatedCustomer) {
        return customerRepository.findById(id)
                .map(customer -> {
                    customer.setId(updatedCustomer.getId());
                    customer.setLastName(updatedCustomer.getLastName());
                    customer.setFirstName(updatedCustomer.getFirstName());
                    customer.setNationality(updatedCustomer.getNationality());
                    customer.setPassport(updatedCustomer.getPassport());
                    customer.setGender(updatedCustomer.getGender());
                    customer.setBirth(updatedCustomer.getBirth());
                    customer.setPhoneNumber(updatedCustomer.getPhoneNumber());
                    customer.setEmail(updatedCustomer.getEmail());
                    customer.setCheckIn(updatedCustomer.getCheckIn());
                    customer.setCheckOut(updatedCustomer.getCheckOut());
                    return customerRepository.save(customer);
                }).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    @GetMapping("/unassigned")
    public List<Customer> getUnassignedCustomers() {
        return customerRepository.findByRoomIsNull();
    }
}
