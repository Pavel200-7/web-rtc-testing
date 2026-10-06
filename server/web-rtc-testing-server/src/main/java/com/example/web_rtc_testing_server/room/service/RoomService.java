package com.example.web_rtc_testing_server.room.service;

import java.io.IOException;

public interface RoomService {
    void createRoom(String roomName) throws IOException;
    boolean roomExists(String roomName) throws IOException;
}
