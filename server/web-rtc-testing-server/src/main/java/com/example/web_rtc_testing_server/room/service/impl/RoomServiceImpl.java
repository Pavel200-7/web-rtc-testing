package com.example.web_rtc_testing_server.room.service.impl;

import com.example.web_rtc_testing_server.room.service.RoomService;
import io.livekit.server.LiveKitAPI;
import livekit.LivekitModels.Room;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final LiveKitAPI api;

    @Override
    public void createRoom(String roomName) throws IOException {
        if (roomExists(roomName)) {
            log.info("The room for connector already exists");
            return;
        }

        api.getRoom().createRoom(roomName)
                .execute();
        log.info("The room for connector has been created");
    }

    @Override
    public boolean roomExists(String roomName) throws IOException {
        List<Room> rooms = api.getRoom()
                .listRooms(List.of(roomName))
                .execute()
                .body();
        log.info("Rooms found: {}", rooms.stream()
                .map(room -> room.getName())
                .collect(Collectors.joining(", ", "{ ", " }")));
        return !rooms.isEmpty();
    }
}
