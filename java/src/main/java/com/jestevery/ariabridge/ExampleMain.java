package com.jestevery.ariabridge;

import java.util.List;

public class ExampleMain {
    public static void main(String[] args) throws Exception {
        String url = System.getenv().getOrDefault("ARIA_BRIDGE_URL", "ws://localhost:9877");
        String secret = System.getenv().getOrDefault("ARIA_BRIDGE_SECRET", "dev-secret");
        AriaBridgeClient client = new AriaBridgeClient(url, secret, "java-example", List.of("console", "error"));
        client.start();
        client.sendConsole("info", "hello from java");
        client.sendError("sample error");
        Thread.sleep(500);
        client.stop();
    }
}
