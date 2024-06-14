package com.groupware.notice.controller;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/nt")
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

    @PostMapping("/notice-write")
    public String processNoticeWrite(NoticeDTO noticeDTO) {
        noticeDTO.setCreated_at(String.valueOf(LocalDateTime.now()));  // 생성 시간을 현재 시간으로 설정
        noticeService.addNotice(noticeDTO);
        return "redirect:/nt/nMain";
    }

    @GetMapping("/nMain")
    public String noticeList(Model model) {
        List<NoticeDTO> notices = noticeService.getAllNotices();
        model.addAttribute("notices", notices);
        return "notice/main-notice";
    }

}
