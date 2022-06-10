package com.telus.unicorn.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "carts")
public class Cart {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(name = "cart_data", nullable = false)
	private int cartdata;
	
	@Column(name = "cart_uni", nullable = false)
	private String cartuni;
	
	@Column(name = "cart_from", nullable = false)
	private String cartfrom;
	
	@Column(name = "cart_to", nullable = false)
	private String cartto;
	
	@Column(name = "skull", nullable = false)
	private String skull;
	
	@Column(name = "cart_qty", nullable = false)
	private String cartqty;

}
