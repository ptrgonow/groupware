package com.groupware.config;

import org.apache.catalina.session.FileStore;
import org.apache.catalina.session.PersistentManager;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatConfig {

    @Bean
    public TomcatContextCustomizer tomcatContextCustomizer() {
        return context -> {
            PersistentManager persistentManager = new PersistentManager();
            FileStore fileStore = new FileStore();
            fileStore.setDirectory("sessions");  // 루트 디렉토리 내의 sessions 디렉토리를 사용
            persistentManager.setStore(fileStore);
            context.setManager(persistentManager);
        };
    }
}

