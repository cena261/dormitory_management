package cena.dorm_management.Dorm_Admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DormAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(DormAdminApplication.class, args);
	}

}
