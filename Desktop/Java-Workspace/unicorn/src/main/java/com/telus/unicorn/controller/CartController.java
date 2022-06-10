package com.telus.unicorn.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.telus.unicorn.dto.CartDto;
import com.telus.unicorn.exception.ResourceNotFoundException;
import com.telus.unicorn.impl.CartServiceImplementation;
import com.telus.unicorn.model.Cart;
import com.telus.unicorn.service.CartService;

@RestController
@RequestMapping("/api/v1")

public class CartController {
	
	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private CartService cartService;
	
	@Autowired
	private CartServiceImplementation alternativeService;

	public CartController(CartService cartService) {
		super();
		this.cartService = cartService;
	}

//	@GetMapping("/cart/{id}")
//	public ResponseEntity<Cart> getCartById(@PathVariable(value = "id") int cartId) throws ResourceNotFoundException {
//		Cart cart = cartService.getCartById(cartId);
//		return ResponseEntity.ok().body(cart);
//
//	}
	
	@GetMapping("cart/{id}")
	public String[] cartStatus(@PathVariable(value="id")long id) throws ResourceNotFoundException {
		return alternativeService.getStatus(id);
	}
	
	@DeleteMapping("cart/{id}")
	public String deleteCartById(@PathVariable(value="id")long id) throws ResourceNotFoundException {
		return alternativeService.deleteCartBid(id);
	}
	
	
	@PostMapping("/cart")
	public ResponseEntity<CartDto> createCart(@RequestBody CartDto cartDto) {

		// DTO to Entity
		Cart cartRequest = modelMapper.map(cartDto, Cart.class);

		Cart cart = cartService.createCart(cartRequest);

		// Entity to DTO
		CartDto cartResponse = modelMapper.map(cart, CartDto.class);

		return new ResponseEntity<CartDto>(cartResponse, HttpStatus.CREATED);
	}
	

}
