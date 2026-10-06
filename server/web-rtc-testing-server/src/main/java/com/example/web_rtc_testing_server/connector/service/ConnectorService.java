package com.example.web_rtc_testing_server.connector.service;

import java.io.IOException;

public interface ConnectorService {
    String getConnectionToken(String roomName) throws IOException;
}
