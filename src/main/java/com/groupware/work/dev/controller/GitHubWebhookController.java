package com.groupware.work.dev.controller;


import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@RequestMapping("/github-webhook")
public class GitHubWebhookController {

    private JsonNode lastPayloadJson;

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody JsonNode payload) {
        // 페이로드를 처리하는 로직을 추가합니다.
        lastPayloadJson = payload;
        System.out.println("Received webhook payload: " + payload.toString());

        // 필요한 작업을 수행한 후, 응답을 반환합니다.
        return ResponseEntity.ok("Received");
    }

    @GetMapping("/data")
    @ResponseBody
    public ResponseEntity<JsonNode> getPayload() {
        return ResponseEntity.ok(lastPayloadJson);
    }

}
