package com.example.web_rtc_testing_server.token.service.impl;

import com.example.web_rtc_testing_server.common.conf.webrtc.service.LiveKitProperties;
import com.example.web_rtc_testing_server.token.service.ConnectionTokenFactory;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ConnectionTokenFactoryImpl implements ConnectionTokenFactory {

    private final LiveKitProperties properties;

    public String getConnectionToken(String roomName) {
        AccessToken token = new AccessToken(properties.getApiKey(), properties.getApiSecret());

        token.setIdentity(UUID.randomUUID().toString());
        token.addGrants(new RoomJoin(true), new RoomName(roomName));

        return token.toJwt();
    }
}
