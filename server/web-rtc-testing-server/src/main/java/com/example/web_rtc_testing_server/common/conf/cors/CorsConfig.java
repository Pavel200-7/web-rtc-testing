package com.example.web_rtc_testing_server.common.conf.cors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/api/**")  // Разрешаем все API-эндпоинты
//                        .allowedOrigins("http://localhost:5173")  // URL вашего Vite-сервера
//                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                        .allowedHeaders("*")
//                        .allowCredentials(true)
//                        .maxAge(3600);
//            }
//        };
//    }


    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")  // ← Разрешаем ВСЕ источники
                        .allowedMethods("*")  // ← Разрешаем ВСЕ методы
                        .allowedHeaders("*")  // ← Разрешаем ВСЕ заголовки
                        .allowCredentials(false) // ← Должно быть false, если allowedOrigins = "*"
                        .maxAge(3600);
            }
        };
    }
}