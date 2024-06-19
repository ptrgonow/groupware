package com.groupware.work.dev.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.groupware.work.dev.dto.GitHookDTO;
import com.groupware.work.dev.service.DevService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/github-webhook")
public class GitHubWebhookController {

    private final DevService devService;

    public GitHubWebhookController(DevService devService) {
        this.devService = devService;
    }

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody JsonNode payload) {

        GitHookDTO gitHookDTO = new GitHookDTO();
        gitHookDTO.setPayload(payload.toString());
        gitHookDTO.setCreatedAt(new Date());

        devService.saveGitHook(gitHookDTO);

        // 필요한 작업을 수행한 후, 응답을 반환합니다.
        return ResponseEntity.ok("Received");
    }

    @GetMapping("/data")
    @ResponseBody
    public ResponseEntity<List<GitHookDTO>> getGitHookData() {
        List<GitHookDTO> gitHookData = devService.getGitHookData();
        return ResponseEntity.ok(gitHookData);
    }

}
