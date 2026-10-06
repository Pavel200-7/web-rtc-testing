package com.example.web_rtc_testing_server.connector.controller;

import com.example.web_rtc_testing_server.connector.dto.ConnectionToken;
import com.example.web_rtc_testing_server.connector.service.ConnectorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/connector")
@RequiredArgsConstructor
public class ConnectorController {

    private final ConnectorService connectorService;

    @GetMapping("/token/{roomName}")
    public ResponseEntity<ConnectionToken> getConnectionToken(@PathVariable String roomName) throws IOException {
        String connectionToken = connectorService.getConnectionToken(roomName);

        List.of(1,2,3).stream()
                .findFirst()
                .map(num -> num);

        return ResponseEntity.ok(new ConnectionToken(connectionToken));
    }
}
