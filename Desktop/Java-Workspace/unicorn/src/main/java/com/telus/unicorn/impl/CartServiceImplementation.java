package com.telus.unicorn.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telus.unicorn.exception.ResourceNotFoundException;
import com.telus.unicorn.model.Cart;
import com.telus.unicorn.repository.CartRepository;
import com.telus.unicorn.service.CartService;

@Service
public class CartServiceImplementation implements CartService {

	
	@Autowired
	private final CartRepository cartRepository;

	public CartServiceImplementation(CartRepository cartRepository) {
		super();
		this.cartRepository = cartRepository;
	}

	@Override
	public Cart getCartById(long id) throws ResourceNotFoundException {
		Cart cart = cartRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employee Id does not exist.." + id));
		return cart;
	}
	
	public String[] getStatus(long id) throws ResourceNotFoundException {
		cartRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Cart Not Found with reference id: " + id));
		String[] arr={"content type here...","headers here..."};
		return arr;
	}
	
	//delete cart id 
	public String deleteCartBid(long id) throws ResourceNotFoundException {
		Cart cart = cartRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Cart Not Found with reference id: " + id));
	
		if(cart.getCartdata() == 1) {
			return "Ok";
		}
		
		return "cart not found data number = " + cart.getCartdata();
	}
	

	@Override
	public Cart createCart(Cart cart) {
		return cartRepository.save(cart);
	}

}
