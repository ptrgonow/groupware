package com.groupware.notice.controller;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class NoticeController {

    private final NoticeService noticeService;

    @Autowired
    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("/notice-write")
    public String noticeWrite() {
        return "notice/notice-write";
    }

    @GetMapping("/notice")
    public String noticeList(Model model) {
        List<NoticeDTO> notices = noticeService.getAllNotices();
        model.addAttribute("notices", notices);
        return "/notice/main-notice";
    }
}