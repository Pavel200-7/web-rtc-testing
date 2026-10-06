package com.example.web_rtc_testing_server.connector.dto;


import lombok.*;

@Value
@Builder
@NoArgsConstructor(force = true, access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class ConnectionToken {
    public String body;
}
