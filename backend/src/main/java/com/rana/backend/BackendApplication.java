package com.rana.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Value;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Value("${app.jwtSecret}")
	private String jwtSecret; 

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) {
		System.out.println("jwt secret length = " + jwtSecret.length());
		System.out.println("first 10 chars = " + jwtSecret.substring(0, 10) + "...");
	}
}