package com.groupware;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

import java.io.IOException;

@SpringBootApplication
@EnableJdbcHttpSession
public class GroupwareApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(GroupwareApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        startNgrok();
    }

    private void startNgrok( ) {
        ProcessBuilder processBuilder = new ProcessBuilder("./run-ngrok.sh", String.valueOf(9244));

        processBuilder.inheritIO(); // 프로세스 출력을 현재 프로세스 출력으로 설정
        try {
            Process process = processBuilder.start();
            System.out.println("ngrok 실행에 성공했습니다.");
            // 애플리케이션 종료 시 ngrok 프로세스를 종료하도록 설정
            Runtime.getRuntime().addShutdownHook(new Thread(process::destroy));
        } catch (IOException e) {
            System.out.println("ngrok 실행에 실패했습니다.");
        }
    }
}
