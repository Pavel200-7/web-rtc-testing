package com.example.web_rtc_testing_server.connector.service.impl;

import com.example.web_rtc_testing_server.connector.service.ConnectorService;
import com.example.web_rtc_testing_server.room.service.RoomService;
import com.example.web_rtc_testing_server.token.service.ConnectionTokenFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConnectorServiceImpl implements ConnectorService {

    private final ConnectionTokenFactory tokenFactory;
    private final RoomService roomService;

    @Override
    public String getConnectionToken(String roomName) throws IOException {
        roomService.createRoom(roomName);
        return tokenFactory.getConnectionToken(roomName);
    }
}
