package com.telus.unicorn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telus.unicorn.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart,Long> {

}
