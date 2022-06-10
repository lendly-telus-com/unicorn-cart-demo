package com.telus.unicorn.service;



import com.telus.unicorn.exception.ResourceNotFoundException;
import com.telus.unicorn.model.Cart;


public interface CartService {
	
	Cart getCartById(long id) throws ResourceNotFoundException;
	
	Cart createCart(Cart cart);

}
