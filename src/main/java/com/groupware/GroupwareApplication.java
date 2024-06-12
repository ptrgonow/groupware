package com.groupware;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

import java.util.TimeZone;

@SpringBootApplication
@EnableJdbcHttpSession
public class GroupwareApplication {

    public static void main(String[] args) {
        SpringApplication.run(GroupwareApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }
}
